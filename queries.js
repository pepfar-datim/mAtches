const path = require('path');
const fs = require('fs');
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

const checkForID = (uid, table) => {
  var promise = new Promise(function(resolve, reject) {
    pool.query("SELECT * FROM " + table + " WHERE uid='" + uid +"';", (error, results) => {
      if (error) {
        throw error
      }
      resolve(results.rowCount > 0)      
    })
  })
  return promise
}

const updateMap = (request,response) => {
  //update
}

const createMap = (request,response) => {
  var map = request.body;
  var uid = '' //should define as random at first and then redefine
  if (request.body.hasOwnProperty('uid')) {
    uid = request.body.uid;
  }  
    checkForID(uid, 'maps').then(res => {
      if(res){
        //if id exists, return error
      }
      else{
        //otherwise proceed to upload
      }
    })
  console.log('uploading for ' + request.params.id);
  fs.writeFileSync('public/maps/' + request.params.id + ".json", JSON.stringify(request.body), (err) => {
        if (err) {
            console.log(err)
        }
    })
  response.status('200').end('received upload\n')
}

module.exports = {
  getAll,
  getSpecificResource,
  createMap
}
