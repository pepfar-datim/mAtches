const helpers = require('./helpers.js')
const fs = require('fs');

const csv = require('csv');
var fetch = require('node-fetch');

const config = require('./config.json');
var convert = require('./convert.js');
var validateServices = require('./validateValueMap.js');
var validateValueMap = validateServices.validateValueMap;
var convertToFHIR = convert.convertToFHIR;
splitNumber = config.base.split('/').length;

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
        console.log(err)
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

const getFHIRQuestionnaires = (request, response) => {
    fetch(config.fhirServer + '/Questionnaire?_format=json')
    .then(response => response.json())
    .then(data => {
      response.status(200).end(JSON.stringify(data.entry));
    })
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
    if (data.hasOwnProperty('error')) response.status(200).send('');
    response.status(400).end('problem accessing resource');
  });  
}

const getSpecificQuestionnaire = (request, response) => {
  fetch(config.fhirServer + '/Questionnaire/?url=' + request.params.id + '&_format=json')
  .then(response => response.json())
  .then(data => {
    var questionnaire = data.entry[0];
    var valueSetURLS = [];
    valueSetURLS = getValueMaps(questionnaire.resource.item, [], []);
    Promise.all(
      valueSetURLS.map(url => 
        fetch(url.fetchURL)
          .then(res => res.json())
          .then(res => [res.expansion.contains, url.path])
      )
    )
    .then(valueSets => {
      for (vs of valueSets) {
        questionnaire.resource.item = loadValueMaps(questionnaire.resource.item, vs)
      }
      //console.log(JSON.stringify(questionnaire))
      response.status(200).end(JSON.stringify(questionnaire));
    });
    
    
  })
}

const loadValueMaps = (items, vs) => {
  if (vs[1].length > 1) {
    var newPath = vs[1].slice(1);
    items[vs[1][0]].item = loadValueMaps(items[vs[1][0]].item, [vs[0], newPath])
  } else {
    items[vs[1][0]].answerValueSet = {}
    items[vs[1][0]].answerValueSet.concept = vs[0];
  }
  return items
}

const getValueMaps = (items, valueSetArray, tempPath) => {
    for (let i =0; i<items.length; i++) {
      if (items[i].hasOwnProperty('item')) {
        var tempPathCopy = [...tempPath];
        tempPathCopy.push(i);
        valueSetArray = getValueMaps(items[i].item, valueSetArray, tempPathCopy);
      } else {
        if (items[i].hasOwnProperty('answerValueSet')) {
          var tempPathCopy = [...tempPath];
          tempPathCopy.push(i);

          var fetchURL = config.fhirServer + '/ValueSet/$expand?url=' + encodeURI(items[i].answerValueSet) + '&_format=json';
          valueSetArray.push({"fetchURL": fetchURL, path: tempPathCopy})
        }
      }
    }
    return valueSetArray
}

const getValueMap = () => {
  var promise = new Promise(function(resolve, reject) {
    fetch(config.fhirServer + '/ValueSet/$expand?url=http%3A%2F%2Fhl7.org%2Ffhir%2FValueSet%2Fadministrative-gender&_format=json')
    .then(response => response.json())
    .then(data => {
      resolve(data.expansion.contains)
    })    
  })
  return promise
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
      "maps": ['name', 'created', 'updated', 'uid', 'questionnaireuid', 'complete'],
      "questionnaires": ['name', 'created', 'updated', 'uid']
    };
    var undesiredProperties = {
      "maps": "map",
      "questionnaires": "questionnaire"
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
            //add back in map or questionnaire
            scrubbedObject[undesiredProperties[endpoint]] = payload[undesiredProperties[endpoint]];
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

const validateMapPayload = (payload, uid, update) => {
  var promise = new Promise(function(resolve, reject) {
    if (!payload.hasOwnProperty('name')) {
      resolve('Name is required')
    }
    if (!payload.hasOwnProperty('questionnaireuid')) {
      resolve('Questionnaire UID is required')
    }
    if (update) {
      resolve(true)
    }

    checkForSpecificProp(payload.name.replace(/'/gi,"''"), 'maps', 'name').then(nameConflict => {
      if (nameConflict.hasOwnProperty('error')) {
        response.status(400).end(nameConflict.error);
      }
      if (nameConflict) {
        resolve('Name (' + payload.name + ') already exists(, or request is invalid)')
      }          
      resolve(true)
    })
        
  })
  return promise
}

const validateValueMapPayload = (request, response) => {
    validateValueMap(request.body).then(res => {
      response.status(200).json(res);  
    })
    
}

const updateMapFiles = (request, response, uid, update) => {
  validateMapPayload(request.body, uid, update).then(validity => {
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
      updateMapFiles(request, response, uid, false);
    }
  })
}


const updateMap = (request, response) => {
  var map = request.body;
  if (!request.body.hasOwnProperty('uid')) {
    response.status(400).end('Missing uid\n');
  }
  var uid = request.body.uid;
  updateMapFiles(request, response, uid, true);
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

  readResource('./persistency/maps/' + request.params.id + '.json').then((data) => {
    if (data.hasOwnProperty('data')) {
      var map = {map: data.data.map};
        readResource('./persistency/maps/' + request.params.id + '.json').then((dataQ) => {
          if (dataQ.hasOwnProperty('data')) {
            var questionnaireURL = dataQ.data.url;
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
          }
          if (dataQ.hasOwnProperty('error')) {
            response.status(400).end(dataQ.error);
          }
        });
    }
    if (data.hasOwnProperty('error')) {
      response.status(400).end(data.error);
    } 
  });

}

module.exports = {
  getAll,
  getFHIRQuestionnaires,
  checkName,
  getSpecificResource,
  getSpecificQuestionnaire,
  createMap,
  updateMap,
  deleteSpecificResource,
  createQuestionnaire,
  uploadData,
  validateValueMapPayload
}
