import React, { Component } from "react";
import {Grid, Paper, Card, Typography, IconButton, Button, Chip, TextField, FormControl, FormHelperText, Input, InputLabel, AppBar, Tabs, Tab, Box, CircularProgress} from "@material-ui/core";

import {AddCircleOutlined, Publish, ImageSearch, Edit, Save, DeleteForever}  from "@material-ui/icons";

import EditCard from "./EditCard.js";
import ValueMapCard from "./ValueMapCard.js";
import UploadSource from "./UploadSource.js";
import TreeNavigation from "./TreeNavigation.js";

import api from "./services/api.js";
import { uploadFile } from "./services/validateFile.js";

import loadMapQuestionnaire from "./services/loadMapQuestionnaire.js";
import loadMapFromMap from "./services/loadMapFromMap.js";

import {stylesObj} from './styling/stylesObj.js';

function pushMapBack(tempMap, mapValidity) {
  tempMap.complete = mapValidity;
  api.put("api/maps", tempMap)
}

function removeAssociationQuestionnaire(tempCheck, mapping, header) {
  if (mapping.hasOwnProperty("path")) {
    var position = mapping.path.length - 1;
    var qLocation = mapping.path[position].linkid;
    tempCheck.flatQuestionnaire[qLocation].header = "";
  }
  return tempCheck;
}

function getCurrentAssociation(tempCheck, prop) {
  var currentAssociation = "";
  if (tempCheck.flatQuestionnaire.hasOwnProperty(prop)) {
    if (tempCheck.flatQuestionnaire[prop].hasOwnProperty("header")) {
      currentAssociation = tempCheck.flatQuestionnaire[prop].header;
    }    
  }
  return currentAssociation;
}

function checkValidity(flatQuestionnaire, mappings) {
  let mapValidity = true;
  for (var k in flatQuestionnaire) {
    if (!flatQuestionnaire[k].required) {
      break
    }
    let mappedToHeader = !!(flatQuestionnaire[k].header || '').length;
    let mappedToConstant = !!(Object.keys((flatQuestionnaire[k].constant || {})).length);
    mapValidity = !(mappedToHeader == mappedToConstant);
    if (mappedToHeader) {
      mapValidity = mappings.headers.hasOwnProperty(flatQuestionnaire[k].header);
    }
    if (mappedToConstant) {
      mapValidity = mappings.constants.hasOwnProperty(k);
    }
    if (!mapValidity) {
      break;
    }    
  }
  for (var i in mappings.headers) {
    if (mappings.headers[i].valueType == "choice") {
      if (!mappings.headers[i].hasOwnProperty("choiceMap")) {
        mapValidity = false;
        break;
      }
      if (Object.keys(mappings.headers[i].choiceMap).length == 0) {
        mapValidity = false;
        break;
      }
    }
  }
  return mapValidity;
}

function handleDelete(header) {
  var tempMap = this.state.map;
  var tempCheck = this.state.mapCheck;
  var tempUnmappedHeaders = this.state.unmappedHeaders;
  tempCheck = removeAssociationQuestionnaire(
    tempCheck,
    tempMap.map.headers[header],
    header
  );
  delete tempMap.map.headers[header];
  delete tempUnmappedHeaders[header];
  var mapValidity = false; //mapValidity false if there are unmapped headers
  if (Object.keys(tempUnmappedHeaders).length == 0) {
    mapValidity = checkValidity(tempCheck.flatQuestionnaire, tempMap.map);
  }
  this.setState({
    map: tempMap,
    mapCheck: tempCheck,
    unmappedHeaders: tempUnmappedHeaders,
    mapValidity: mapValidity
  });
  pushMapBack(tempMap, mapValidity);
}

function processAdd(tempMap, tempUnmappedHeaders, tempHeader, headerPath) {
  if (!tempMap.map.headers.hasOwnProperty(tempHeader)) {
    tempMap.map.headers[tempHeader] = {headerPath};
    if (!tempUnmappedHeaders.hasOwnProperty(tempHeader)) {
      tempUnmappedHeaders[tempHeader] = {headerPath};
    }
  }
  return {tempMap, tempUnmappedHeaders};
}

function parseJSON(obj, path, tempMap, tempUnmappedHeaders, headersStructure) {
  for (let key in obj) {
    let updatedPath = [...path, key]
    let tempType = Array.isArray(obj[key]) ? 'array' : typeof(obj[key])
    headersStructure.push({"type": tempType, key, "id": extractHeaderFromPath(updatedPath)})
    if (Array.isArray(obj[key])) {
      headersStructure[headersStructure.length-1]['items'] = []
      for (let i = 0; i < obj[key].length; i++) {
        headersStructure[headersStructure.length-1]['items'][i] = {"type": typeof(obj[key][i]), "key": i, "id": extractHeaderFromPath([...updatedPath, i])}
        if (typeof(obj[key][i]) === 'object') {
          headersStructure[headersStructure.length-1]['items'][i]['items'] = [];
          let tempHS = [];
          ([tempMap, tempUnmappedHeaders, tempHS] = parseJSON(obj[key][i], [...updatedPath, i], tempMap, tempUnmappedHeaders, tempHS))
          headersStructure[headersStructure.length-1]['items'][i]['items'] = tempHS;
        } else {
          ({tempMap, tempUnmappedHeaders} = processAdd(tempMap, tempUnmappedHeaders, extractHeaderFromPath([...updatedPath, i]), [...updatedPath, i]))
        }
      }
    } else if (typeof(obj[key]) === 'object') {
      headersStructure[headersStructure.length-1]['items'] = [];
      let tempHS = [];
      ([tempMap, tempUnmappedHeaders, tempHS] = parseJSON(obj[key], updatedPath, tempMap, tempUnmappedHeaders, tempHS))
      headersStructure[headersStructure.length-1]['items'] = tempHS;
    } else {
      ({tempMap, tempUnmappedHeaders} = processAdd(tempMap, tempUnmappedHeaders, extractHeaderFromPath(updatedPath), updatedPath))

    }
  }
  return [tempMap, tempUnmappedHeaders, headersStructure]
}

function extractHeaderFromPath(path) {
  return path.reduce((accum, cv, ind) => {
    if (ind > 0 && !Number.isInteger(cv)) {accum = accum + '.'}
    return Number.isInteger(cv) ? accum + '[' + cv + ']' : accum + cv 
  }, '')
}

function readFileContent(file) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = event => resolve(event.target.result);
    reader.onerror = error => reject(error);
    reader.readAsText(file);
  });
}

class MapEdit extends Component {
  formatHeaders(currentMap, _this) {
    if (this.state.map.fileType == 'json' && this.state.map.headersStructure) {
        return (
          <>
            <Button 
              variant="contained" 
              style={stylesObj.resetSourceButton}
              onClick={() => {this.clearJSON()}}
            >
              Reset Source
              <DeleteForever />      
            </Button>
            {Object.keys(this.state.map.headersStructure).length &&
              <TreeNavigation 
                currentHeaders={this.state.map.map.headers}
                data={this.state.map.headersStructure}>
              </TreeNavigation>
            }
          </>
        )
    }
    return Object.keys(currentMap.headers).map((k, i) => {
      return (
        <div key={"chip_" + i}>
          <Chip
            label={k.length > 30 ? k.substring(0,30) + '...' : k}
            onDelete={this.handleDelete.bind(this,k)}
            style={currentMap.headers[k].hasOwnProperty('path') ? stylesObj.mappedChip : stylesObj.unmappedChip}
            data-cy={"chip_" + k}
          />
        </div>
      );
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      map: { name: "", uid: "", map: {headers: {}} },
      questionnaire: { resource: {name: "" }},
      mapCheck: { flatQuestionnaire: {} },
      newHeaderName: "",
      editValueMap: false,
      header: "",
      mapID: "",
      unmappedHeaders: {},
      tabChoice: 0,
      loading: true,
      editingName: false,
      headerUsed: false,
      fileError: false,
    };
    this.clearJSON = this.clearJSON.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleAssociationChangeHeader = this.handleAssociationChangeHeader.bind(this);
    this.handleConstantChange = this.handleConstantChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleValueMap = this.handleValueMap.bind(this);
    this.handleValueMapClose = this.handleValueMapClose.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleMapUpload = this.handleMapUpload.bind(this);
    this.handleEditMapName = this.handleEditMapName.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleMapNameChange = this.handleMapNameChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.processCSV = this.processCSV.bind(this);
    this.processJSON = this.processJSON.bind(this);
  }

  componentDidMount() {
    loadMapQuestionnaire(this.props.id, this);
    // need to check the answer option set and load as constant if relevant
  }

  handleAdd() {
    var tempHeader = this.state.newHeaderName;
    if (
      this.state.map.map.headers.hasOwnProperty(tempHeader) || 
      this.state.unmappedHeaders.hasOwnProperty(tempHeader)
    ) {
      this.setState({headerUsed: true})
    }
    if (!this.state.map.map.headers.hasOwnProperty(tempHeader)) {
      let {tempMap, tempUnmappedHeaders} = processAdd(this.state.map, this.state.unmappedHeaders, tempHeader, [tempHeader]);
      var mapValidity = false; //map validity is false when you add a header because it's not associated yet
      this.setState({
        map: tempMap,
        newHeaderName: "",
        unmappedHeaders: tempUnmappedHeaders,
        mapValidity: mapValidity
      });
      pushMapBack(tempMap, mapValidity);
    }
  }

  handleDelete(header) {
    var tempMap = this.state.map;
    var tempCheck = this.state.mapCheck;
    var tempUnmappedHeaders = this.state.unmappedHeaders;
    tempCheck = removeAssociationQuestionnaire(
      tempCheck,
      tempMap.map.headers[header],
      header
    );
    delete tempMap.map.headers[header];
    delete tempUnmappedHeaders[header];
    var mapValidity = false; //mapValidity false if there are unmapped headers
    if (Object.keys(tempUnmappedHeaders).length == 0) {
      mapValidity = checkValidity(tempCheck.flatQuestionnaire, tempMap.map);
    }
    this.setState({
      map: tempMap,
      mapCheck: tempCheck,
      unmappedHeaders: tempUnmappedHeaders,
      mapValidity: mapValidity
    });
    pushMapBack(tempMap, mapValidity);
  }

  clearJSON() {
    let tempMap = this.state.map;
    tempMap.map.headers = {};
    delete tempMap.headersStructure;
    let tempUnmappedHeaders = [];
    let mapValidity = false;
    let tempMapCheck = this.state.mapCheck;
    for (let k in tempMapCheck.flatQuestionnaire) {
      delete tempMapCheck.flatQuestionnaire[k].header;
    }
    this.setState({
      map: tempMap, 
      unmappedHeaders: tempUnmappedHeaders, 
      mapValidity: mapValidity,
      mapCheck: tempMapCheck
    });
    pushMapBack(tempMap, mapValidity);
  }

  handleEditMapName() {
    if (this.state.editingName) {
      if (this.state.tempName != this.state.map.name) {
        let tempMap = Object.assign({},this.state.map);
        tempMap.name = this.state.tempName;
        pushMapBack(tempMap, tempMap.complete);
        this.setState({editingName: false, tempName: '', map: tempMap})  
      } else {
        this.setState({editingName: false, tempName: ''})
      }

      
    } else {
      this.setState({editingName: true, tempName: this.state.map.name, validName: true})
    }

  }

  handleNameChange(event) {
    var tempName = event.target.value;
    this.setState({headerUsed: false})
    if (this.state.timeout) {
      clearTimeout(this.state.timeout);
    }
    this.setState({
      checking: true,
      newHeaderName: tempName,
      timeout: setTimeout(() => {
        this.checkName(tempName);
      }, 1000)
    });
  }

  handleMapNameChange(event) {
    var tempName = event.target.value;
    if (this.state.timeout) {clearTimeout(this.state.timeout)}
    this.setState({
      checking: true,
      tempName: tempName,
      timeout: setTimeout(() => {
        this.checkMapName(tempName, this);
      }, 1000) 
    });
  }

  checkMapName(name, _this){
    if (name) {
      api.get('api/maps/names/' + encodeURI(name))
      .then(nameFound => {
        _this.setState({
          validName: !nameFound.hasOwnProperty('uid'),
          checking: false
        })
      })      
    } else {
      _this.setState({validName: false, checking: false})
    }
  }

  handleTabChange(event, newValue) {
    this.setState({ tabChoice: newValue });
  }

  handleMapUpload(baseMapId) {
    api.get('api/maps/' + baseMapId)
    .then(baseMap => {
      var returnObj = loadMapFromMap(JSON.parse(JSON.stringify(this.state.mapCheck.flatQuestionnaire)), JSON.parse(JSON.stringify(baseMap)), JSON.parse(JSON.stringify(this.state.map)), JSON.parse(JSON.stringify(this.state.unmappedHeaders)));
      var tempMapCheck = JSON.parse(JSON.stringify(this.state.mapCheck));
      tempMapCheck.flatQuestionnaire = returnObj.flatQuestionnaire;    
      this.setState({mapCheck: tempMapCheck, map: returnObj.newMap, unmappedHeaders: returnObj.unmappedHeaders})

      var mapValidity = false; //mapValidity false if there are unmapped headers
      if (Object.keys(returnObj.unmappedHeaders).length == 0) {
        mapValidity = checkValidity(tempMapCheck.flatQuestionnaire, returnObj.newMap.map);
      }
      pushMapBack(returnObj.newMap, mapValidity);
    })
  }

  handleAssociationChangeHeader(event) {
    var tempMap = this.state.map;
    var tempCheck = this.state.mapCheck;
    var tempUnmappedHeaders = this.state.unmappedHeaders;
    
    // clear out current association in map
    var currentAssociation = getCurrentAssociation(
      tempCheck,
      event.target.name
    );
    if (currentAssociation.length && (currentAssociation != event.target.value)) {
      tempMap.map.headers[currentAssociation] = {};
      tempUnmappedHeaders[currentAssociation] = {};
    }

    // clear out assocation in flat questionnaire
    tempCheck = removeAssociationQuestionnaire(
      tempCheck,
      tempMap.map.headers[event.target.value],
      event.target.value
    );

    tempCheck.flatQuestionnaire[event.target.name].header =
      event.target.value;
    tempMap.map.headers[event.target.value].path = tempCheck.flatQuestionnaire[event.target.name].path.slice();
    tempMap.map.headers[event.target.value].valueType =
      tempCheck.flatQuestionnaire[event.target.name].valueType;
    delete tempUnmappedHeaders[event.target.value];
    var mapValidity = false; //assume false until proven otherwise
    if (Object.keys(tempUnmappedHeaders).length == 0) {
      mapValidity = checkValidity(
        tempCheck.flatQuestionnaire,
        tempMap.map
      );
    }
    this.setState({
      mapCheck: tempCheck,
      map: tempMap,
      unmappedHeaders: tempUnmappedHeaders,
      mapValidity: mapValidity
    });
    pushMapBack(tempMap, mapValidity);
  }

  handleConstantChange(qLocation, changeType, constantValue) {
    let tempMap = this.state.map;
    let tempCheck = this.state.mapCheck;
    let tempUnmappedHeaders = this.state.unmappedHeaders;
    if (changeType == 'add') {
      let tempHeader = tempCheck.flatQuestionnaire[qLocation].header || '';
      tempCheck.flatQuestionnaire[qLocation].constant = constantValue;
      tempCheck.flatQuestionnaire[qLocation].header = '';
      if (tempMap.map.headers.hasOwnProperty(tempHeader)) {
        tempMap.map.headers[tempHeader] = {};
        tempUnmappedHeaders[tempHeader] = {};
      }
      tempMap.map.constants[qLocation] = constantValue;      
    } 
    if (changeType == 'delete') {
        delete tempCheck.flatQuestionnaire[qLocation].constant;
        delete tempMap.map.constants[qLocation];      
    }
    let tempMapValidity = false;
    if (Object.keys(this.state.unmappedHeaders).length == 0) {
      tempMapValidity = checkValidity(tempCheck.flatQuestionnaire, tempMap.map);
    }
    this.setState({mapCheck:tempCheck, map: tempMap, unmappedHeaders: tempUnmappedHeaders, mapValidity: tempMapValidity});
    pushMapBack(tempMap, tempMapValidity);
  }

  handleValueMap(tempHeader, tempID) {
    this.setState({ editValueMap: true, header: tempHeader, mapID: tempID });
  }

  handleValueMapClose(event, choiceMap, header) {
    var tempMap = this.state.map;
    tempMap.map.headers[header].choiceMap = choiceMap;
    var mapValidity = false; //assume false until proven otherwise
    if (Object.keys(this.state.unmappedHeaders).length == 0) {
      mapValidity = checkValidity(
        this.state.mapCheck.flatQuestionnaire,
        tempMap.map
      );
    }
    this.setState({
      editValueMap: false,
      map: tempMap,
      mapValidity: mapValidity
    });
    pushMapBack(tempMap, mapValidity);
  }

  processCSV(csvText) {
    try {
      let columns = csvText.split(/\r\n|\n/)[0].split(",");
      let tempMap = JSON.parse(JSON.stringify(this.state.map));
      let originalMap = JSON.parse(JSON.stringify(tempMap));
      let tempUnmappedHeaders = JSON.parse(JSON.stringify(this.state.unmappedHeaders));
      let mapValidity = true;
      for (let i = 0; i < columns.length; i++) {
        ({tempMap, tempUnmappedHeaders} = processAdd(tempMap, tempUnmappedHeaders, columns[i].trim(), [columns[i].trim()]))
      }
      if (tempMap != originalMap) {
        this.setState({ map: tempMap, unmappedHeaders: tempUnmappedHeaders });
        pushMapBack(tempMap, mapValidity);
      }
    } catch (e) {
      console.log(e)
      this.setState({fileError: true})
    }
  }

  processJSON(jsonObj) {
    try {
      let obj = JSON.parse(jsonObj);
      if (Array.isArray(obj)) {obj = obj[0]}
      if (typeof(obj) !== 'object') {throw new Error('File is not a valid JSON object')}

      let tempMap = JSON.parse(JSON.stringify(this.state.map));
      let originalMap = JSON.parse(JSON.stringify(tempMap));
      let tempUnmappedHeaders = JSON.parse(JSON.stringify(this.state.unmappedHeaders));
      let mapValidity = true;
      let headersStructure = [];

      ([tempMap, tempUnmappedHeaders, headersStructure] = parseJSON(obj, [], tempMap, tempUnmappedHeaders, headersStructure))
      if (tempMap != originalMap) {
        tempMap.headersStructure = headersStructure;
        this.setState({ map: tempMap, unmappedHeaders: tempUnmappedHeaders });
        pushMapBack(tempMap, mapValidity);
      }

    } catch (e) {
      console.log(e);
      this.setState({fileError: true});
    }
  }

  handleUpload(e) {
    this.setState({fileError: false})
    e.preventDefault();
    uploadFile(e, this).then(fileText => {
      switch (this.state.map.fileType) {
        case 'json':
          this.processJSON(fileText);
          break;
        default:
          this.processCSV(fileText);
          break;
      }
      
    });
  }

  render() {
    return (
      <>{this.state.loading ? <CircularProgress style={stylesObj.loaderStyling} /> :
        <>{this.state.failedToLoad ? <><Typography>{this.state.failedToLoad}</Typography></> :
              <>
      <div style={stylesObj.themePadding}>
        {this.state.editValueMap && (
          <ValueMapCard
            map={this.state.map}
            header={this.state.header}
            onValueMapClose={this.handleValueMapClose}
            mapCheck={this.state.mapCheck}
            mapID={this.state.mapID}
          />
        )}
        {!this.state.editValueMap && this.state.mapValidity != undefined && (
          <Grid container className={stylesObj.flexGrow} wrap="nowrap" spacing={2}>
            <Grid item xs={3} style={stylesObj.gridWidth}>
              <Card
                style={stylesObj.sideCard}
                wrap="wrap"
              >
                <div style={stylesObj.themePadding}>
                  <Typography variant="h6">
                    <span style={stylesObj.textBold}>Map name: </span>                 
                    
                    {!this.state.editingName &&
                      <>
                      <span>{this.state.map.name}</span>
                      <IconButton
                        edge="start"
                        aria-label="menu"
                        onClick={this.handleEditMapName}
                        style={stylesObj.nameEditIcon}
                      >
                        <Edit />
                      </IconButton>
                      </>
                    }
                    {this.state.editingName &&
                      <>
                      <TextField
                        style={stylesObj.addHeaderText}
                        id="name_editedValue"
                        value={this.state.tempName}
                        margin="normal"
                        onChange={this.handleMapNameChange}
                      />
                      <IconButton
                        edge="start"
                        aria-label="menu"
                        onClick={this.handleEditMapName}
                        style={stylesObj.nameEditIcon}
                        disabled={!this.state.validName || this.state.checking}
                      >
                        <Save />
                      </IconButton>
                      {!this.state.validName && 
                        <Typography variant="body1" style={stylesObj.invalidName}>
                          Invalid Name
                        </Typography>}
                      </>
                    }                    
                  </Typography>
                  <Typography variant="body1">
                    <span style={stylesObj.textBold}>Questionnaire: </span>
                    {this.state.questionnaire.resource.name}
                  </Typography>
                  <Typography variant="body1" style={stylesObj.mapTextEnd}>
                    <span style={stylesObj.textBold}>file type: </span>
                    {this.state.map.fileType}
                  </Typography>
                  <Typography variant="h6">
                    <span style={stylesObj.textBold}>
                      {this.state.map.fileType == 'csv' ? 'Source Headers' : 'Source Structure'}
                    </span>
                  </Typography>
                  <UploadSource 
                    fileError = {this.state.fileError}
                    fileType = {this.state.map.fileType || 'csv'}
                    handleAdd = {this.handleAdd}
                    handleMapUpload = {this.handleMapUpload}
                    handleNameChange = {this.handleNameChange}
                    handleTabChange = {this.handleTabChange}
                    handleUpload = {this.handleUpload}
                    headerUsed = {this.state.headerUsed}
                    id = {this.props.id}
                    newHeaderName = {this.state.newHeaderName}
                    tabChoice = {this.state.tabChoice}
                  />
                  <br />
                  {this.state.map.map && (
                    <div>{this.formatHeaders(this.state.map.map, this)}</div>
                  )}
                </div>
              </Card>
            </Grid>
            <Grid item xs>
              <EditCard
                mapCheck={this.state.mapCheck}
                map={this.state.map}
                onAssociation={this.handleAssociationChangeHeader}
                constantChange={this.handleConstantChange}
                onValueMap={this.handleValueMap}
                unmappedHeaders={this.state.unmappedHeaders}
                mapValidity={this.state.mapValidity}
              />
            </Grid>
          </Grid>
        )}
      </div>
      </>

        }</> 

    }</>
    );
  }
}

export default MapEdit;