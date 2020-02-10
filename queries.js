const helpers = require('./helpers.js')
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

const getAll = (request, response) => {
  var type = request.path.split('/')[splitNumber];
  if (!checkTable(type)) {
     response.status(403).end('Invalid\n') 
  }

  const query = {
    text: "SELECT * FROM " + type + " ORDER BY id ASC;"
  }
  
  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const checkName = (request, response) => {
  var type = request.path.split('/')[splitNumber];
  if (!checkTable(type)) {
     response.status(403).end('Invalid\n') 
  }

  const query = {
    text: "SELECT uid FROM " + type + " WHERE name=$1;",
    values: [request.params.name]
  }

  pool.query(query, (error, results) => {
    if (error) {
      response.status(400).end(error)
    }
    var uidToReturn = (results.rows.length > 0) ? results.rows[0] : {}
    response.status(200).send(uidToReturn)
  })

}

const getSpecificResource = (request, response) => {
  var type = request.path.split('/')[splitNumber];
  if (!checkTable(type)) {
     response.status(403).end('Invalid\n') 
  }  
  const query = {
    text: "SELECT * FROM " + type + " WHERE uid=$1",
    values: [request.params.id]
  }
  pool.query(query, (error, results) => {
    if (error) {
      response.status(400).end(error)
    }
    response.status(200).json(results.rows[0])
  })
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

    checkForProp(payload.name.replace(/'/gi,"''"), 'maps', 'name', uid).then(nameConflict => {
      if (nameConflict) {
        resolve('Name (' + payload.name + ') already exists(, or request is invalid)')
      }
      checkForProp(payload.questionnaireuid, 'questionnaires', 'uid').then(questFound => {
        if (!questFound) {
          resolve('questionnaireuid (' + payload.questionnaireuid + ') is invalid(, or request is invalid)')
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
  }  
  checkForProp(uid, 'maps', 'uid').then(idConflict => {
    if (idConflict) {
      response.status(400).end('The uid provided/generated (' + uid + ') already exists. Please update and try again.\n')
    }
    else {
      validateMapPayload(request.body, uid).then(validity => {
        if(validity === true){
          addToDB(request.body, uid).then(success => {
            if (success) {
              response.status(200).json('{"uid": "' + uid + '", "message":' + '"Uploaded map for: ' + uid + '"}');              
            }
            else {
              response.status(400).end('Problem with database upload\n');
            }          
          });
        }
        else {
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
  //delete from database

  const query = {
    text: "DELETE FROM " + type + " WHERE uid=$1;",
    values: [uid]
  }

  pool.query(query, (error, results) => {
    if (error) {
      response.status(400).end('Failed to delete from database')
    }
    else {
      if (results.rowCount>0) {
        response.status(200).end('Deleted ' + indType + ' with uid of: ' + uid + '\n'); 
      }
      else {
        response.status(400).end('Failed to delete from database')
      }
    }
  })
}

//there are no validation checks here because users will not being interacting with this route
//call is added for convenience of developing/deploying
const createQuestionnaire = (request, response) => {
  var payload = request.body
  var uid = helpers.generateUID(); //should define as random at first and then redefine
  if (payload.hasOwnProperty('uid')) {
    uid = payload.uid;
  }  
  var now = new Date().toISOString();
  if (!payload.hasOwnProperty('created')) {
    payload.created = now;
  }
  if (!payload.hasOwnProperty('updated')) {
    payload.updated = now;
  }

  const query = {
    text: "INSERT INTO questionnaires (name, created, updated, uid, questionnaire) VALUES ($1, $2, $3, $4, $5);",
    values: [payload.name, payload.created, payload.updated, uid, payload.questionnaire]
  }  

  pool.query(query, (error, results) => {
    if (error) {
      response.status(400).end(error +'\n')
    }
    response.status(200).end('Uploaded questionnaire for: ' + uid + '\n')
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
              console.log(e)
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
