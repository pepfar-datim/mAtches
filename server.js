const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');
const app = express()
const api = require('./queries')
const port = 5001

const DIST_DIR = path.join(__dirname, './dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');
const ERROR_FILE = path.join(DIST_DIR, 'error.html');
app.use(bodyParser.json())
app.use(bodyParser.text())

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(express.static(DIST_DIR));

const config = require('./config.json')
const basePath = config.base;

app.get(basePath + 'api/maps', api.getAll)

app.get(basePath + 'api/maps/names/:name', api.checkName);

app.get(basePath + 'api/maps/:id', api.getSpecificResource);

app.post(basePath + 'api/maps', api.createMap);

app.put(basePath + 'api/maps', api.updateMap);

app.post(basePath + 'api/maps/:id/upload', api.uploadData);

app.delete(basePath + 'api/maps/:id', api.deleteSpecificResource);

app.get(basePath + 'api/questionnaires', api.getAll)

app.get(basePath + 'api/questionnaires/:id', api.getSpecificResource);

app.post(basePath + 'api/questionnaires', api.createQuestionnaire);

app.delete(basePath + 'api/questionnaires/:id', api.deleteSpecificResource);

app.get(basePath, (req, res) => {
 res.sendFile(HTML_FILE);
});

app.get(basePath + 'maps', (req, res) => {
 res.sendFile(HTML_FILE);
});

app.get(basePath + 'maps/:id', (req, res) => {
 res.sendFile(HTML_FILE);
});

app.get('*', (req, res) => {
  res.status(500).sendFile(ERROR_FILE);
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
