const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');
const app = express()
const api = require('./queries')
const port = 5001
const DIST_DIR = path.join(__dirname, './dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');
const ERROR_FILE = path.join(__dirname, 'error.html');
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(express.static(DIST_DIR));


app.get('/api/maps', api.getAll)

app.get("/api/maps/names/:name", api.checkName);

app.get("/api/maps/:id", api.getSpecificResource);

app.post('/api/maps', api.createMap);

app.put('/api/maps', api.updateMap);

app.delete("/api/maps/:id", api.deleteSpecificResource);

app.get('/api/questionnaires', api.getAll)

app.get("/api/questionnaires/:id", api.getSpecificResource);

app.post('/api/questionnaires', api.createQuestionnaire);

app.delete("/api/questionnaires/:id", api.deleteSpecificResource);

app.get('/', (req, res) => {
 res.sendFile(HTML_FILE);
});

app.get('/maps', (req, res) => {
 res.sendFile(HTML_FILE);
});

app.get('/maps/:id', (req, res) => {
 res.sendFile(HTML_FILE);
});

app.get('*', (req, res) => {
  res.status(500).sendFile(ERROR_FILE);
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})