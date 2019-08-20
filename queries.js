const path = require('path');
const fs = require('fs');
const helpers = require('./helpers.js')
const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: 'password',
  port: 5432,
})

const getAll = (request, response) => {
  var type = request.path.split('/')[2];
  pool.query('SELECT * FROM ' + type + ' ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getSpecificResource = (request, response) => {
    var type = request.path.split('/')[2];
    const resourceJSON = require(path.join(__dirname + "/public/" + type + "/" + request.params.id + ".json"))
    response.json(resourceJSON);
}

const checkForProp = (value, table, column, uidExclude) => {
  var promise = new Promise(function(resolve, reject) {
    var checkStatement = "SELECT * FROM " + table + " WHERE " + column + "='" + value +"'";
    if (uidExclude) {
      checkStatement += " AND uid != '" + uidExclude + "'"
    }
    checkStatement += ";"
    pool.query(checkStatement, (error, results) => {
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
    if (!payload.hasOwnProperty('lastUpdated')) {
      payload.lastUpdated = now;
    }
    var insertStatement = "INSERT INTO maps (name, created, updated, uid, questionnaireUID) VALUES ('" + payload.name + "','"+payload.created + "','" + payload.lastUpdated + "','" + uid + "','" + payload.questionnaireUID +"');";
    pool.query(insertStatement, (error, results) => {
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
    payload.lastUpdated = now;

    var updateStatement = "UPDATE maps SET name='"+payload.name+"', created='"+payload.created+"', updated='"+payload.lastUpdated+"', questionnaireUID='"+payload.questionnaireUID+"' WHERE uid='"+uid+"';"
    pool.query(updateStatement, (error, results) => {
      if (error) {
        throw error
      }
      resolve(results.rowCount > 0)
    })
  })
  return promise
}

const uploadResource = (payload, uid) => {
  var promise = new Promise(function(resolve, reject) {  
    console.log('uploading for ' + uid);
    fs.writeFile('public/maps/' + uid + ".json", JSON.stringify(payload), (err) => {
      if (err) {
        console.log(err);
        resolve(err)
      }
      else {
        resolve(true)
      }
    })
  })
  return promise
}

const validateMapPayload = (payload, uid) => {
  var promise = new Promise(function(resolve, reject) {
    if (!payload.hasOwnProperty('name')) {
      resolve('Name is required')
    }
    if (!payload.hasOwnProperty('questionnaireUID')) {
      resolve('Questionnaire UID is required')
    }

    checkForProp(payload.name, 'maps', 'name', uid).then(nameConflict => {
      if (nameConflict) {
        resolve('Name (' + payload.name + ') already exists')
      }
      checkForProp(payload.questionnaireUID, 'questionnaires', 'uid').then(questFound => {
        if (!questFound) {
          resolve('questionnaireUID (' + payload.questionnaireUID + ') is invalid')
        }
        resolve(true)
      })
    })
        
  })
  return promise
}

const createMap = (request,response) => {
  var map = request.body;
  var uid = helpers.generateUID(); //should define as random at first and then redefine
  if (request.body.hasOwnProperty('uid')) {
    uid = request.body.uid;
  }  
  checkForProp(uid, 'maps', 'uid').then(idConflict => {
    if (idConflict) {
      response.status('400').end('The uid provided/generated (' + uid + ') already exists. Please update and try again.\n')
    }
    else {
      validateMapPayload(request.body, uid).then(validity => {
        if(validity === true){
          addToDB(request.body, uid).then(success => {
            if (success) {
              uploadResource(request.body, uid).then(uploadSuccess =>{
                if (uploadSuccess === true) {
                  response.status('200').end('Uploaded map for: ' + uid + '\n');
                }
                else {
                  response.status('400').end('Could not upload map for + ' + uid + '\n' + uploadSuccess +'\n');
                }                
              });
            }
            else {
              response.status('400').end('Problem with database upload\n');
            }
          })
        }
        else {
          response.status('400').end('Problem with payload: ' + validity + '\n');
        }
      })
    }
  })
}

const updateMap = (request, response) => {
  var map = request.body;
  if (!request.body.hasOwnProperty('uid')) {
    response.status('400').end('Missing uid\n');
  }
  var uid = request.body.uid;
  validateMapPayload(request.body, uid).then(validity => {
    if (validity === true) {
      updateDB(request.body, uid).then(success => {
        if (success) {
          uploadResource(request.body, uid).then(uploadSuccess =>{
            if (uploadSuccess === true) {
              response.status('200').end('Updated map with uid of: ' + uid + '\n');
            }
            else {
              response.status('400').end('Could not update map with uid of: ' + uid + '\n' + uploadSuccess +'\n');
            }
          })
        }
        else {
         response.status('400').end('Problem updating database for ' + uid + '. Map with this id may not exist\n'); 
        }
      })
    }
    else {
      response.status('400').end('Problem with payload: ' + validity + '\n');
    }
  })
}      

const deleteMap = (request, response) => {
  var uid = request.params.id;
  //delete from database
  pool.query("DELETE FROM maps WHERE uid='" + uid +"';", (error, results) => {
    if (error) {
      response.status(400).end('Failed to delete from database. Map with uid of ' + uid + ' may not exist\n')
    }
    else {
      fs.unlink('public/maps/' + uid + ".json", (err) => {
        if (err) {
          response.status('400').end('Could not find map with uid of: ' + uid + '\n');
        }
        else {
          response.status('200').end('Deleted map with uid of: ' + uid + '\n'); 
        }
      })      
    }
  })
}

module.exports = {
  getAll,
  getSpecificResource,
  createMap,
  updateMap,
  deleteMap
}
