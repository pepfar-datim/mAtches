import React, { Component } from "react";
import {Grid, Paper, Card, Typography, IconButton, Edit, Chip, TextField, FormControl, FormHelperText, Input, InputLabel, AppBar, Tabs, Tab, Box} from "@material-ui/core";

import {AddCircleOutlined, Publish, ImageSearch}  from "@material-ui/icons";

import EditCard from "./EditCard.js";
import ValueMapCard from "./ValueMapCard.js";
import UploadMapList from "./UploadMapList.js";

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
  var mapValidity = true;
  for (var i in flatQuestionnaire) {
    if (!flatQuestionnaire[i].hasOwnProperty("header")) {
      mapValidity = false;
      break;
    }
    if (flatQuestionnaire[i].header == "") {
      mapValidity = false;
      break;
    }
  }
  for (var i in mappings) {
    if (mappings[i].valueType == "choice") {
      if (!mappings[i].hasOwnProperty("choiceMap")) {
        mapValidity = false;
        break;
      }
      if (Object.keys(mappings[i].choiceMap).length == 0) {
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
    tempMap.map[header],
    header
  );
  delete tempMap.map[header];
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

function handleNameChange(event) {
  var tempName = event.target.value;
  if (this.state.timeout) {
    clearTimeout(this.state.timeout);
  }
  this.setState({
    checking: true,
    newHeaderName: tempName,
    timeout: setTimeout(() => {
      checkName(tempName);
    }, 1000)
  });
}

function checkName(tempName) {
  //could add warning here if name already exists
}

function processAdd(tempMap, tempUnmappedHeaders, tempHeader) {
  if (!tempMap.map.hasOwnProperty(tempHeader)) {
    tempMap.map[tempHeader] = {};
    if (!tempUnmappedHeaders.hasOwnProperty(tempHeader)) {
      tempUnmappedHeaders[tempHeader] = {};
    }
  }
  return [tempMap, tempUnmappedHeaders];
}

function handleAdd() {
  var tempMap = this.state.map;
  var tempHeader = this.state.newHeaderName;
  if (!tempMap.map.hasOwnProperty(tempHeader)) {
    var tempUnmappedHeaders = this.state.unmappedHeaders;
    var addResult = processAdd(tempMap, tempUnmappedHeaders, tempHeader);
    tempMap = addResult[0];
    tempUnmappedHeaders = addResult[1];
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

function readFileContent(file) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = event => resolve(event.target.result);
    reader.onerror = error => reject(error);
    reader.readAsText(file);
  });
}

function a11yProps(index) {
  return {
    id: `scrollable-prevent-tab-${index}`,
    "aria-controls": `scrollable-prevent-tabpanel-${index}`
  };
}

class MapEdit extends Component {
  formatHeaders(currentMap, _this) {
    return Object.keys(currentMap).map(function(k, i) {
      return (
        <div key={"chip_" + i}>
          <Chip
            label={k}
            onDelete={handleDelete.bind(_this, k)}
            style={stylesObj.smallMargin}
          />
        </div>
      );
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      map: { name: "", uid: "" },
      questionnaire: { name: "" },
      mapCheck: { flatQuestionnaire: {} },
      newHeaderName: "",
      editValueMap: false,
      header: "",
      mapID: "",
      unmappedHeaders: {},
      value: 0
    };
    this.handleAssociationChange = this.handleAssociationChange.bind(this);
    this.handleValueMap = this.handleValueMap.bind(this);
    this.handleValueMapClose = this.handleValueMapClose.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleMapUpload = this.handleMapUpload.bind(this);
  }

  componentDidMount() {
    loadMapQuestionnaire(this.props.id, this);
  }

  handleTabChange(event, newValue) {
    this.setState({ value: newValue });
  }

  handleMapUpload(baseMap) {
    var returnObj = loadMapFromMap(JSON.parse(JSON.stringify(this.state.mapCheck.flatQuestionnaire)), JSON.parse(JSON.stringify(baseMap)), JSON.parse(JSON.stringify(this.state.map)), JSON.parse(JSON.stringify(this.state.unmappedHeaders)));
    var tempMapCheck = JSON.parse(JSON.stringify(this.state.mapCheck));
    tempMapCheck.flatQuestionnaire = returnObj.flatQuestionnaire;    
    this.setState({mapCheck: tempMapCheck, map: returnObj.newMap, unmappedHeaders: returnObj.unmappedHeaders})

    var mapValidity = false; //mapValidity false if there are unmapped headers
    if (Object.keys(returnObj.unmappedHeaders).length == 0) {
      mapValidity = checkValidity(tempMapCheck.flatQuestionnaire, returnObj.newMap.map);
    }
    pushMapBack(returnObj.newMap, mapValidity);

  }

  handleAssociationChange(event) {
    var tempMap = this.state.map;
    var tempCheck = this.state.mapCheck;
    var tempUnmappedHeaders = this.state.unmappedHeaders;
    
    // clear out current association in map
    var currentAssociation = getCurrentAssociation(
      tempCheck,
      event.target.name
    );
    if (currentAssociation.length && (currentAssociation != event.target.value)) {
      tempMap.map[currentAssociation] = {};
      tempUnmappedHeaders[currentAssociation] = {};
    }

    // clear out assocation in flat questtionaire
    tempCheck = removeAssociationQuestionnaire(
      tempCheck,
      tempMap.map[event.target.value],
      event.target.value
    );

    tempCheck.flatQuestionnaire[event.target.name].header =
      event.target.value;
    tempMap.map[event.target.value].path = tempCheck.flatQuestionnaire[event.target.name].path.slice();
    tempMap.map[event.target.value].valueType =
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

  handleValueMap(tempHeader, tempID) {
    this.setState({ editValueMap: true, header: tempHeader, mapID: tempID });
  }

  handleValueMapClose(event, choiceMap, header) {
    var tempMap = this.state.map;
    tempMap.map[header].choiceMap = choiceMap;
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

  uploadAction(e) {
    this.refs.fileInput.click(e);
  }

  uploadCallback(csvText) {
    var columnRow = csvText.split(/\r\n|\n/)[0];
    var columns = columnRow.split(",");
    var tempMap = this.state.map;
    var originalMap = JSON.parse(JSON.stringify(tempMap));
    var tempUnmappedHeaders = this.state.unmappedHeaders;
    var mapValidity = true;
    for (let i = 0; i < columns.length; i++) {
      var addResult = processAdd(tempMap, tempUnmappedHeaders, columns[i]);
      tempMap = addResult[0];
      tempUnmappedHeaders = addResult[1];
    }
    if (tempMap != originalMap) {
      this.setState({ map: tempMap, unmappedHeaders: tempUnmappedHeaders });
      pushMapBack(tempMap, mapValidity);
    }
  }

  upload(e) {
    e.preventDefault();
    uploadFile(e, this).then(csvFile => {
      this.uploadCallback(csvFile);
    });
  }

  render() {
    const value = 1;
    return (
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
                    <strong>Map name: </strong>
                    {this.state.map.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Questionnaire: </strong>
                    {this.state.questionnaire.name}
                  </Typography>
                  <br />
                  <br />
                  <Typography variant="h6">
                    <strong>Source Headers</strong>
                  </Typography>
                  <br />
                  <div style={stylesObj.whiteBackground}>
                    <Tabs
                      value={this.state.value}
                      onChange={this.handleTabChange}
                      style={stylesObj.mappingBoxBanner}
                      TabIndicatorProps={{
                        style: stylesObj.tabIndicator
                      }}
                    >
                      <Tab
                        style={stylesObj.minWidth}
                        icon={<AddCircleOutlined />}
                        aria-label="add"
                        {...a11yProps(0)}
                      />
                      <Tab
                        style={stylesObj.minWidth}
                        icon={<Publish />}
                        aria-label="upload"
                        {...a11yProps(1)}
                      />
                      <Tab
                        style={stylesObj.minWidth}
                        icon={<ImageSearch />}
                        aria-label="fromMap"
                        {...a11yProps(2)}
                      />
                    </Tabs>

                    <div hidden={this.state.value !== 1}>
                      <Typography variant="body1">
                        Upload Headers from CSV
                      </Typography>
                      <TextField
                        disabled={true}
                        label={this.state.filename}
                        value={this.state.fileName}
                      />
                      <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={e => {
                          this.uploadAction(e);
                        }}
                      >
                        <Publish />
                      </IconButton>
                      <form style={stylesObj.hidden}>
                        <input
                          type="file"
                          ref="fileInput"
                          accept=".csv"
                          onChange={ev => {
                            this.upload(ev);
                          }}
                        />
                      </form>
                      <br />
                    </div>
                    <div hidden={this.state.value !== 0}>
                      <TextField
                        style={stylesObj.addHeaderText}
                        id="standard-name"
                        label="Add a Header"
                        value={this.state.newHeaderName}
                        margin="normal"
                        onChange={handleNameChange.bind(this)}
                      />
                      <br />
                      <IconButton
                        edge="start"
                        aria-label="menu"
                        onClick={handleAdd.bind(this)}
                      >
                        <AddCircleOutlined />
                      </IconButton>
                    </div>
                    <div hidden={this.state.value !== 2}>
                      <UploadMapList onMapProcess={this.handleMapUpload} id={this.props.id}/>
                    </div>
                    <br />
                  </div>
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
                onAssociation={this.handleAssociationChange}
                onValueMap={this.handleValueMap}
                unmappedHeaders={this.state.unmappedHeaders}
                mapValidity={this.state.mapValidity}
              />
            </Grid>
          </Grid>
        )}
      </div>
    );
  }
}

export default MapEdit;