const helpers = require('./helpers.js')
const fs = require('fs');

const Pool = require('pg').Pool;
const csv = require('csv');
var fetch = require('node-fetch');

const config = require('./config.json');
var convert = require('./convert.js');
var validateServices = require('./validateValueMap.js');
var validateValueMap = validateServices.validateValueMap;
var convertToFHIR = convert.convertToFHIR;
splitNumber = config.base.split('/').length;

const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: 'password',
  port: 5432,
})

const allowableQuery = {
  "maps": {
    "uid": true,
    "name": true
  },
  "questionnaires": {
    "uid": true,
    "name": true    
  }
}

const checkTable = (table) => {
  return allowableQuery.hasOwnProperty(table)
}

const checkColumn = (table, column) => {
  var valid = false;
  if (allowableQuery.hasOwnProperty(table)) {
    if (allowableQuery[table].hasOwnProperty(column)) {
      valid = true;
    }
  }
  return valid
}

const readResource = (fileName) => {
  var promise = new Promise(function(resolve, reject) {
    fs.readFile(fileName, (err, data) => {
      if (err) {
        resolve({"error": err}) 
      } else {
        var parsedData = JSON.parse(data);
        resolve({"data": parsedData})
      }
    })  
  })
  return promise
}

const writeResource = (fileName, data) => {
  var promise = new Promise(function(resolve, reject) {
    fs.writeFile(fileName, data, (err) => {
      if (err) resolve({"error": err})
      resolve({"success": true})
    })  
  })
  return promise
}

const deleteResource = (fileName) => {
  var promise = new Promise(function(resolve, reject) {
    fs.unlink(fileName, (err) => {
      if (err) resolve({"error": err})
      resolve({"success": true})
    })  
  })
  return promise  
}

const getAll = (request, response) => {
  var type = request.path.split('/')[splitNumber];
  if (!checkTable(type)) {
     response.status(403).end('Invalid\n')
  }
  readResource('./persistency/' + type + '/' + type + '.json').then((data) => {
    if (data.hasOwnProperty('data')) {
      var cleanedData = getAllClean(data.data);
      response.status(200).json(cleanedData); 
    }
    if (data.hasOwnProperty('error')) {
      response.status(400).end(JSON.stringify(data.error)); 
    }
    response.status(400).end('problem accessing resource');
  });
}

const getAllClean = (data) => {
  var dataArray = []
  for (var i in data) {
    dataArray.push(data[i])
  }
  return dataArray
}

const checkName = (request, response) => {
  var type = request.path.split('/')[splitNumber];
  if (!checkTable(type)) {
     response.status(403).end('Invalid\n') 
  }
  checkForSpecificProp(request.params.name,'maps','name').then(nameFound => {
    if (nameFound.hasOwnProperty('error')) {
      response.status(400).end(nameConflict.error)
    }
    if (nameFound) {
      response.status(200).send(nameFound)
    } else {
      response.status(200).send({})  
    }   
  })
}

const getSpecificResource = (request, response) => {
  var type = request.path.split('/')[splitNumber];
  if (!checkTable(type)) {
     response.status(403).end('Invalid\n') 
  }
  readResource('./persistency/' + type + '/' + request.params.id + '.json').then((data) => {
    if (data.hasOwnProperty('data')) response.status(200).json(data.data);
    if (data.hasOwnProperty('error')) response.status(400).end(data.error);
    response.status(400).end('problem accessing resource');
  });  
}

const checkForSpecificProp = (value, resource, prop) => {
  var promise = new Promise(function(resolve, reject) {
    readResource('./persistency/' + resource + '/' + resource + '.json').then((data) => {
      if (data.hasOwnProperty('error')) resolve(data)
      for (var i in data.data) {
        if (data.data[i].hasOwnProperty(prop)) {
          if (data.data[i][prop] == value) {
            resolve({"uid": data.data[i].uid})
          }
        }
      }
      resolve(false)
    })
  })
  return promise  
}

const checkForUID = (uid, resource) => {
  var promise = new Promise(function(resolve, reject) {
    readResource('./persistency/' + resource + '/' + resource + '.json').then((data) => {
      if (data.hasOwnProperty('error')) resolve(data)
      resolve(data.data.hasOwnProperty(uid))
    })
  })
  return promise
}

const checkForProp = (value, table, column, uidExclude) => {
  var promise = new Promise(function(resolve, reject) {
    if (!checkTable(table)) {resolve(true)}
    if (!checkColumn(table, column)) {resolve(true)}

    var query = {
      text: "SELECT * FROM " + table + " WHERE " + column + "=$1;",
      values: [value]
    }

    if (uidExclude) {
      query.text = "SELECT * FROM " + table + " WHERE " + column + "=$1 AND uid!=$2;";
      query.values = [value, uidExclude];
    }
    
    pool.query(query, (error, results) => {
      if (error) {
        throw error
      }
      resolve(results.rowCount > 0)      
    })
  })
  return promise
}

const addToSummary = (payload, uid, endpoint) => {
  var promise = new Promise(function(resolve, reject) {
    var now = new Date().toISOString();
    if (!payload.hasOwnProperty('created')) {
      payload.created = now;
    }
    if (!payload.hasOwnProperty('updated')) {
      payload.updated = now;
    }
    if (!payload.hasOwnProperty('complete')) {
      payload.complete = false;
    }
    var desiredProperties = {
      "maps": ['name', 'created', 'updated', 'uid', 'questionnaireuid', 'complete', 'map'],
      "questionnaires": ['name', 'created', 'updated', 'uid', 'questionnaire']
    };
    var scrubbedObject = {}

    for (let i=0; i<desiredProperties[endpoint].length; i++) {
      scrubbedObject[desiredProperties[endpoint][i]] = payload[desiredProperties[endpoint][i]];
    }
    readResource('./persistency/'+ endpoint + '/' + endpoint + '.json').then(file => {
      if (file.hasOwnProperty('data')) {
        file.data[uid] = scrubbedObject;
        writeResource('./persistency/'+ endpoint + '/' + endpoint + '.json', JSON.stringify(file.data)).then(status => {
          if (status.hasOwnProperty('success')) {
            resolve(scrubbedObject)
          } else {
            resolve(file)
          }
        })
      } else {
        resolve(file)
      }
    }) 
  })
  return promise
}

const addToDB = (payload, uid) => {
  var promise = new Promise(function(resolve, reject) {  
    var now = new Date().toISOString();
    if (!payload.hasOwnProperty('created')) {
      payload.created = now;
    }
    if (!payload.hasOwnProperty('updated')) {
      payload.updated = now;
    }
    if (!payload.hasOwnProperty('complete')) {
      payload.complete = false;
    }
    const query = {
      text: "INSERT INTO maps (name, created, updated, uid, questionnaireuid, complete, map) VALUES ($1, $2, $3, $4, $5, $6, $7);",
      values: [payload.name, payload.created, payload.updated, uid, payload.questionnaireuid, payload.complete, JSON.stringify(payload.map)]
    }

    pool.query(query, (error, results) => {
      if (error) {
        throw error
      }
      resolve(results)
    })
  })
  return promise
}

const updateDB = (payload, uid) => {
  var promise = new Promise(function(resolve, reject) {  
    var now = new Date().toISOString();
    if (!payload.hasOwnProperty('created')) {
      payload.created = now;
    }
    payload.updated = now;
    if (!payload.hasOwnProperty('complete')) {
      payload.complete = false;
    }
    const query = {
      text: "UPDATE maps SET name=$1, created=$2, updated=$3, questionnaireuid=$4, complete=$5, map=$6 WHERE uid=$7;",
      values: [payload.name,payload.created,payload.updated,payload.questionnaireuid,payload.complete,JSON.stringify(payload.map),uid]
    }

    pool.query(query, (error, results) => {
      if (error) {
        throw error
      }
      resolve(results.rowCount > 0)
    })
  })
  return promise
}

const validateMapPayload = (payload, uid) => {
  var promise = new Promise(function(resolve, reject) {
    if (!payload.hasOwnProperty('name')) {
      resolve('Name is required')
    }
    if (!payload.hasOwnProperty('questionnaireuid')) {
      resolve('Questionnaire UID is required')
    }

    checkForSpecificProp(payload.name.replace(/'/gi,"''"), 'maps', 'name').then(nameConflict => {
      if (nameConflict.hasOwnProperty('error')) {
        response.status(400).end(nameConflict.error);
      }
      if (nameConflict) {
        resolve('Name (' + payload.name + ') already exists(, or request is invalid)')
      }
      checkForUID(payload.questionnaireuid, 'questionnaires').then(questFound => {     
        if (!questFound) {
          resolve('questionnaireuid (' + payload.questionnaireuid + ') is invalid(, or request is invalid)')
        }
        if (questFound.hasOwnProperty('error')) {
          response.status(400).end(questFound.error);
        }           
        resolve(true)
      })
    })
        
  })
  return promise
}
const validateValueMapPayload = (request, response) => {
    validateValueMap(request.body).then(res => {
      response.status(200).json(res);  
    })
    
}

const createMap = (request, response) => {
  var map = request.body;
  var uid = helpers.generateUID(); //should define as random at first and then redefine

  if (request.body.hasOwnProperty('uid')) {
    uid = request.body.uid;
  } else {
    request.body.uid = uid;  
  }
  
  checkForUID(uid, 'maps').then(uidFound => {
    if (uidFound) {
      response.status(400).end('The uid provided/generated (' + uid + ') already exists. Please update and try again.\n')
    } else {
      validateMapPayload(request.body, uid).then(validity => {
        if (validity === true) {
          addToSummary(request.body, uid, 'maps').then(result => {
            writeResource('./persistency/maps/' + uid + '.json', JSON.stringify(result)).then(writeStatus => {
              var error = writeStatus.hasOwnProperty('error') ? writeStatus.error : '';
              if (writeStatus.hasOwnProperty('success')) {
                response.status(200).json('{"uid": "' + uid + '", "message":' + '"Uploaded map for: ' + uid + '"}');
              }
              response.status(400).end(JSON.stringify(error));
            })            
          })

        } else {
          response.status(400).end('Problem with payload: ' + validity + '\n');
        } 
      })  
    }
  })
}


const updateMap = (request, response) => {
  var map = request.body;
  if (!request.body.hasOwnProperty('uid')) {
    response.status(400).end('Missing uid\n');
  }
  var uid = request.body.uid;
  validateMapPayload(request.body, uid).then(validity => {
    if (validity === true) {
      updateDB(request.body, uid).then(success => {
        if (success) {
          response.status(200).json({"status": "SUCCESS", "uid": uid});
        }
        else {
         response.status(400).end('Problem updating database for ' + uid + '. Map with this id may not exist\n'); 
        }
      })
    }
    else {
      response.status(400).end('Problem with payload: ' + validity + '\n');
    }
  })
}      

//generalized for questionnaires...however this is just for development convenience.
//a real method to delete questionnaire needs to remove maps tied to questionnaire (or fail until maps are removed)
const deleteSpecificResource = (request, response) => {
  var type = request.path.split('/')[splitNumber];
  if (!checkTable(type)) {
     response.status(403).end('Invalid\n') 
  }  
  var indType = type.substring(0,type.length - 1);
  var uid = request.params.id;
  readResource('./persistency/' + type + '/' + type + '.json').then(file => {
    if (file.hasOwnProperty('data')) {
      if (file.data.hasOwnProperty(uid)) {
        delete file.data[uid]
        writeResource('./persistency/' + type + '/' + type + '.json', JSON.stringify(file.data)).then(a => {
          deleteResource('./persistency/' + type + '/' + uid + '.json').then(b => {
            console.log(b)
            if (b.hasOwnProperty('error')) {
              response.status(400).end(JSON.stringify(b.error));
            }
            response.status(200).send('Removed ' + indType + ' with uid of ' + uid);
          })
        })
      }
    }
  })
  .catch(e => {
    response.status(400).end(JSON.stringify(e));
  })  

}

//there are no validation checks here because users will not being interacting with this route
//call is added for convenience of developing/deploying
const createQuestionnaire = (request, response) => {
  var payload = request.body
  var uid = helpers.generateUID(); //should define as random at first and then redefine
  if (payload.hasOwnProperty('uid')) {
    uid = payload.uid;
  } else {
    payload.uid = uid;
  }
  var now = new Date().toISOString();
  if (!payload.hasOwnProperty('created')) {
    payload.created = now;
  }
  if (!payload.hasOwnProperty('updated')) {
    payload.updated = now;
  }
  addToSummary(request.body, uid, 'questionnaires').then(result => {
    writeResource('./persistency/questionnaires/' + uid + '.json', JSON.stringify(result)).then(writeStatus => {
      var error = writeStatus.hasOwnProperty('error') ? writeStatus.error : '';
      if (writeStatus.hasOwnProperty('success')) {
        response.status(200).json('{"uid": "' + uid + '", "message":' + '"Uploaded questionnaire for: ' + uid + '"}');
      }
      response.status(400).end(JSON.stringify(error));
    })            
  })
}

const uploadData = (request, response) => {
  var url = decodeURIComponent(request.query.url);
  const query = {
    text: "SELECT m.map, q.questionnaire FROM maps m LEFT JOIN questionnaires q ON m.questionnaireuid=q.uid WHERE m.uid=$1",
    values: [request.params.id]
  }
  pool.query(query, (error, results) => {
    if (error) {
      response.status(400).end(error)
    }
      var map = {map: results.rows[0].map};
      var questionnaireURL = results.rows[0].questionnaire.url;
      convertToFHIR(request.body, map, request.params.id, questionnaireURL).then(result =>{
        if (result.hasOwnProperty('errors')) {
          response.status(200).json(result);  
        } else {
          if (url == null || url.trim().toLowerCase() == 'null') {
            response.status(200).json(result);
          } else {
            try {
              fetch(url, 
                {
                  method: "POST",
                  body: JSON.stringify(result.data),
                  headers: { "Content-Type": "application/json" }
                }
              )
              //.then(firstRes => firstRes.text())
              .then(extRes => {
                result.urlResponse = {status: extRes.status, url: extRes.url, body: extRes.body}
                response.status(200).json(result);
              })
            }
            catch (e) {
              result.urlResponse = e;
              response.status(400).json(result);
            }
          }
          //send request to url
        }
        
    })
  });
  
}

module.exports = {
  getAll,
  checkName,
  getSpecificResource,
  createMap,
  updateMap,
  deleteSpecificResource,
  createQuestionnaire,
  uploadData,
  validateValueMapPayload
}
