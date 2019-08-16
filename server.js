const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');
const app = express()
const api = require('./queries')
const port = 5001
const DIST_DIR = path.join(__dirname, './dist'); // NEW
const HTML_FILE = path.join(DIST_DIR, 'index.html'); // NEW
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(express.static(DIST_DIR)); // NEW


app.get('/api/maps', api.getAll)

app.get("/api/maps/:id", api.getSpecificResource);

app.post('/api/maps/:id', api.createMap);

app.get('/api/questionnaires', api.getAll)

app.get("/api/questionnaires/:id", api.getSpecificResource);

app.get('*', (req, res) => {
 res.sendFile(HTML_FILE); // EDIT
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
