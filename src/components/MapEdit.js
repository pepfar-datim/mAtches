import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Card,
  Typography,
  IconButton,
  Button,
  Chip,
  TextField,
  CircularProgress,
} from "@material-ui/core";
import _ from "lodash";

import { Edit, Save, DeleteForever } from "@material-ui/icons";

import EditCard from "./EditCard";
import ValueMapCard from "./ValueMapCard";
import UploadSource from "./UploadSource";
import TreeNav from "./TreeNav";
import LogicMapDialog from "./LogicMapDialog";

import api from "../services/api";
import { uploadFile } from "../services/validateFile";

import loadMapQuestionnaire from "../services/loadMapQuestionnaire";
import loadMapFromMap from "../services/loadMapFromMap";

import { stylesObj } from "../styling/stylesObj";

function pushMapBack(tempMap, mapValidity) {
  api.put("api/maps", { ...tempMap, complete: mapValidity });
}

function removeAssociationQuestionnaire(tempCheck, mapping) {
  const returnCheck = tempCheck;
  if (mapping.path) {
    const position = mapping.path.length - 1;
    const qLocation = mapping.path[position].linkid;
    returnCheck.flatQuestionnaire[qLocation].header = "";
  }
  return returnCheck;
}

function getCurrentAssociation(tempCheck, prop) {
  let currentAssociation = "";
  if (tempCheck.flatQuestionnaire[prop]) {
    if (tempCheck.flatQuestionnaire[prop].header) {
      currentAssociation = tempCheck.flatQuestionnaire[prop].header;
    }
  }
  return currentAssociation;
}

function checkValidity(flatQuestionnaire, mappings) {
  let mapValidity = true;
  Object.keys(flatQuestionnaire).forEach((k) => {
    if (mapValidity && flatQuestionnaire[k].required) {
      const mappedToHeader = !!(flatQuestionnaire[k].header || "").length;
      const mappedToConstant = !!Object.keys(
        flatQuestionnaire[k].constant || {}
      ).length;
      mapValidity = !(mappedToHeader === mappedToConstant);
      if (mappedToHeader) {
        mapValidity = Object.prototype.hasOwnProperty.call(
          mappings.headers,
          flatQuestionnaire[k].header
        );
      }
      if (mappedToConstant) {
        mapValidity = Object.prototype.hasOwnProperty.call(
          mappings.constants,
          k
        );
      }
    }
  });
  Object.keys(mappings.headers).forEach((hItem) => {
    if (hItem.valueType === "choice") {
      if (mapValidity) {
        if (!hItem.choiceMap) {
          mapValidity = false;
        }
        if (Object.keys(hItem.choiceMap).length === 0) {
          mapValidity = false;
        }
      }
    }
  });
  return mapValidity;
}

function processAdd(map, unmappedHeaders, tempHeader, headerPath) {
  const tempMap = map;
  const tempUnmappedHeaders = unmappedHeaders;
  if (!tempMap.map.headers[tempHeader]) {
    tempMap.map.headers[tempHeader] = { headerPath };
    if (!tempUnmappedHeaders[tempHeader]) {
      tempUnmappedHeaders[tempHeader] = { headerPath };
    }
  }
  return { tempMap, tempUnmappedHeaders };
}

function extractHeaderFromPath(path) {
  return path.reduce((accum, cv, ind) => {
    let tempAccum = accum;
    if (ind > 0 && !Number.isInteger(cv)) {
      tempAccum += ".";
    }
    return Number.isInteger(cv) ? `${tempAccum}[${cv}]` : tempAccum + cv;
  }, "");
}

function parseJSON(
  obj,
  path,
  itemPath,
  map,
  unmappedHeaders,
  headersStructureOriginal
) {
  let tempMap = map;
  let tempUnmappedHeaders = unmappedHeaders;
  const headersStructure = headersStructureOriginal;

  Object.keys(obj).forEach((key, index) => {
    const updatedPath = [...path, key];
    const tempType = Array.isArray(obj[key]) ? "array" : typeof obj[key];
    headersStructure.push({
      type: tempType,
      key,
      id: extractHeaderFromPath(updatedPath),
      itemPath: [...itemPath, index],
      path: updatedPath,
    });
    if (Array.isArray(obj[key])) {
      headersStructure[headersStructure.length - 1].items = [];
      for (let i = 0; i < obj[key].length; i += 1) {
        headersStructure[headersStructure.length - 1].items[i] = {
          type: typeof obj[key][i],
          key: i,
          id: extractHeaderFromPath([...updatedPath, i]),
          itemPath: [...itemPath, index, i],
          path: updatedPath,
        };
        if (typeof obj[key][i] === "object") {
          headersStructure[headersStructure.length - 1].items[i].items = [];
          let tempHS = [];
          [tempMap, tempUnmappedHeaders, tempHS] = parseJSON(
            obj[key][i],
            [...updatedPath, i],
            [...itemPath, index, i],
            tempMap,
            tempUnmappedHeaders,
            tempHS
          );
          headersStructure[headersStructure.length - 1].items[i].items = tempHS;
        } else {
          ({ tempMap, tempUnmappedHeaders } = processAdd(
            tempMap,
            tempUnmappedHeaders,
            extractHeaderFromPath([...updatedPath, i]),
            [...updatedPath, i]
          ));
        }
      }
    } else if (typeof obj[key] === "object") {
      headersStructure[headersStructure.length - 1].items = [];
      let tempHS = [];
      [tempMap, tempUnmappedHeaders, tempHS] = parseJSON(
        obj[key],
        updatedPath,
        [...itemPath, index],
        tempMap,
        tempUnmappedHeaders,
        tempHS
      );
      headersStructure[headersStructure.length - 1].items = tempHS;
    } else {
      ({ tempMap, tempUnmappedHeaders } = processAdd(
        tempMap,
        tempUnmappedHeaders,
        extractHeaderFromPath(updatedPath),
        updatedPath
      ));
    }
  });

  return [tempMap, tempUnmappedHeaders, headersStructure];
}

const extractPathString = (itemPath) => {
  let itemLocation = itemPath.reduce(
    (accumulator, currentValue) => `${accumulator}[${currentValue}].items`,
    ""
  );
  itemLocation = itemLocation.replace(/items$/, "logic");
  return itemLocation;
};

class MapEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: { name: "", uid: "", map: { headers: {} } },
      questionnaire: { resource: { name: "" } },
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
      logicMapNode: {},
    };
    this.checkMapName = this.checkMapName.bind(this);
    this.clearJSON = this.clearJSON.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleAssociationChangeHeader = this.handleAssociationChangeHeader.bind(
      this
    );
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
    this.handleClearLogicNode = this.handleClearLogicNode.bind(this);
    this.handleDeleteLogicLeaf = this.handleDeleteLogicLeaf.bind(this);
    this.handleSaveLogicNode = this.handleSaveLogicNode.bind(this);
    this.handleSetLogicNode = this.handleSetLogicNode.bind(this);
    this.processCSV = this.processCSV.bind(this);
    this.processJSON = this.processJSON.bind(this);
  }

  componentDidMount() {
    const { id } = this.props;
    loadMapQuestionnaire(id, this);
    // need to check the answer option set and load as constant if relevant
  }

  handleUpload(e) {
    const { map } = this.state;
    this.setState({ fileError: false });
    e.preventDefault();
    uploadFile(e, this).then((fileText) => {
      switch (map.fileType) {
        case "json":
          this.processJSON(fileText);
          break;
        default:
          this.processCSV(fileText);
          break;
      }
    });
  }

  handleAdd() {
    const { newHeaderName, map, unmappedHeaders } = this.state;
    if (
      Object.prototype.hasOwnProperty.call(map.map.headers, newHeaderName) ||
      Object.prototype.hasOwnProperty.call(unmappedHeaders, newHeaderName)
    ) {
      this.setState({ headerUsed: true });
    }
    if (!Object.prototype.hasOwnProperty.call(map.map.headers, newHeaderName)) {
      const { tempMap, tempUnmappedHeaders } = processAdd(
        map,
        unmappedHeaders,
        newHeaderName,
        [newHeaderName]
      );
      const mapValidity = false; // map validity is false when you add a header because it's not associated yet
      this.setState({
        map: tempMap,
        newHeaderName: "",
        unmappedHeaders: tempUnmappedHeaders,
        mapValidity: false,
      });
      pushMapBack(tempMap, mapValidity);
    }
  }

  handleDelete(header) {
    const { map, mapCheck, unmappedHeaders } = this.state;
    const tempMap = JSON.parse(JSON.stringify(map));
    let tempCheck = JSON.parse(JSON.stringify(mapCheck));
    const tempUnmappedHeaders = JSON.parse(JSON.stringify(unmappedHeaders));

    tempCheck = removeAssociationQuestionnaire(
      tempCheck,
      tempMap.map.headers[header]
    );

    delete tempMap.map.headers[header];
    delete tempUnmappedHeaders[header];

    let mapValidity = false; // mapValidity false if there are unmapped headers
    if (Object.keys(tempUnmappedHeaders).length === 0) {
      mapValidity = checkValidity(tempCheck.flatQuestionnaire, tempMap.map);
    }

    this.setState({
      map: tempMap,
      mapCheck: tempCheck,
      unmappedHeaders: tempUnmappedHeaders,
      mapValidity,
    });

    pushMapBack(tempMap, mapValidity);
  }

  handleEditMapName() {
    const { editingName, map, tempName } = this.state;
    if (editingName) {
      if (tempName !== map.name) {
        const tempMap = JSON.parse(JSON.stringify(map));
        tempMap.name = tempName;
        pushMapBack(tempMap, tempMap.complete);
        this.setState({ editingName: false, tempName: "", map: tempMap });
      } else {
        this.setState({ editingName: false, tempName: "" });
      }
    } else {
      this.setState({
        editingName: true,
        tempName: map.name,
        validName: true,
      });
    }
  }

  handleNameChange(event) {
    const { timeout } = this.state;
    const tempName = event.target.value;
    this.setState({ headerUsed: false });
    if (timeout) {
      clearTimeout(timeout);
    }
    this.setState({
      checking: true,
      newHeaderName: tempName,
      timeout: setTimeout(() => {
        this.checkName(tempName);
      }, 1000),
    });
  }

  handleMapNameChange(event) {
    const { timeout } = this.state;
    const tempName = event.target.value;
    if (timeout) {
      clearTimeout(timeout);
    }
    this.setState({
      checking: true,
      tempName,
      timeout: setTimeout(() => {
        this.checkMapName(tempName);
      }, 1000),
    });
  }

  handleTabChange(event, newValue) {
    this.setState({ tabChoice: newValue });
  }

  handleMapUpload(baseMapId) {
    const { map, mapCheck, unmappedHeaders } = this.state;
    api.get(`api/maps/${baseMapId}`).then((baseMap) => {
      const returnObj = loadMapFromMap(
        JSON.parse(JSON.stringify(mapCheck.flatQuestionnaire)),
        JSON.parse(JSON.stringify(baseMap)),
        JSON.parse(JSON.stringify(map)),
        JSON.parse(JSON.stringify(unmappedHeaders))
      );
      const tempMapCheck = JSON.parse(JSON.stringify(mapCheck));
      tempMapCheck.flatQuestionnaire = returnObj.flatQuestionnaire;
      this.setState({
        mapCheck: tempMapCheck,
        map: returnObj.newMap,
        unmappedHeaders: returnObj.unmappedHeaders,
      });

      let mapValidity = false; // mapValidity false if there are unmapped headers
      if (Object.keys(returnObj.unmappedHeaders).length === 0) {
        mapValidity = checkValidity(
          tempMapCheck.flatQuestionnaire,
          returnObj.newMap.map
        );
      }
      pushMapBack(returnObj.newMap, mapValidity);
    });
  }

  handleAssociationChangeHeader(event) {
    const { map, mapCheck, unmappedHeaders } = this.state;
    const tempMap = JSON.parse(JSON.stringify(map));
    let tempCheck = JSON.parse(JSON.stringify(mapCheck));
    const tempUnmappedHeaders = JSON.parse(JSON.stringify(unmappedHeaders));

    // clear out current association in map
    const currentAssociation = getCurrentAssociation(
      tempCheck,
      event.target.name
    );
    if (
      currentAssociation.length &&
      currentAssociation !== event.target.value
    ) {
      tempMap.map.headers[currentAssociation] = {};
      tempUnmappedHeaders[currentAssociation] = {};
    }

    // clear out assocation in flat questionnaire
    tempCheck = removeAssociationQuestionnaire(
      tempCheck,
      tempMap.map.headers[event.target.value]
    );

    tempCheck.flatQuestionnaire[event.target.name].header = event.target.value;
    tempMap.map.headers[event.target.value].path = tempCheck.flatQuestionnaire[
      event.target.name
    ].path.slice();
    tempMap.map.headers[event.target.value].valueType =
      tempCheck.flatQuestionnaire[event.target.name].valueType;
    delete tempUnmappedHeaders[event.target.value];
    let mapValidity = false; // assume false until proven otherwise
    if (Object.keys(tempUnmappedHeaders).length === 0) {
      mapValidity = checkValidity(tempCheck.flatQuestionnaire, tempMap.map);
    }
    this.setState({
      mapCheck: tempCheck,
      map: tempMap,
      unmappedHeaders: tempUnmappedHeaders,
      mapValidity,
    });
    pushMapBack(tempMap, mapValidity);
  }

  handleConstantChange(qLocation, changeType, constantValue) {
    const { map, mapCheck, unmappedHeaders } = this.state;
    const tempMap = JSON.parse(JSON.stringify(map));
    const tempCheck = JSON.parse(JSON.stringify(mapCheck));
    const tempUnmappedHeaders = JSON.parse(JSON.stringify(unmappedHeaders));

    if (changeType === "add") {
      const tempHeader = tempCheck.flatQuestionnaire[qLocation].header || "";
      tempCheck.flatQuestionnaire[qLocation].constant = constantValue;
      tempCheck.flatQuestionnaire[qLocation].header = "";
      if (tempMap.map.headers[tempHeader]) {
        tempMap.map.headers[tempHeader] = {};
        tempUnmappedHeaders[tempHeader] = {};
      }
      tempMap.map.constants[qLocation] = constantValue;
    }
    if (changeType === "delete") {
      delete tempCheck.flatQuestionnaire[qLocation].constant;
      delete tempMap.map.constants[qLocation];
    }
    let tempMapValidity = false;
    if (Object.keys(unmappedHeaders).length === 0) {
      tempMapValidity = checkValidity(tempCheck.flatQuestionnaire, tempMap.map);
    }
    this.setState({
      mapCheck: tempCheck,
      map: tempMap,
      unmappedHeaders: tempUnmappedHeaders,
      mapValidity: tempMapValidity,
    });
    pushMapBack(tempMap, tempMapValidity);
  }

  handleSetLogicNode(node) {
    this.setState({ logicMapNode: node });
  }

  handleClearLogicNode() {
    this.setState({ logicMapNode: {} });
  }

  handleDeleteLogicLeaf(logic) {
    const { map, unmappedHeaders, mapCheck } = this.state;
    const itemLocation = extractPathString(logic.itemPath);
    const tempMap = JSON.parse(JSON.stringify(map));
    const tempUnmappedHeaders = JSON.parse(JSON.stringify(unmappedHeaders));
    let tempCheck = JSON.parse(JSON.stringify(mapCheck));

    const existingLogic = _.get(tempMap.headersStructure, itemLocation);
    const newLogic = existingLogic.filter((l) => l.id !== logic.id);

    tempCheck = removeAssociationQuestionnaire(
      tempCheck,
      tempMap.map.headers[logic.alias]
    );

    delete tempUnmappedHeaders[logic.alias];
    delete tempMap.map.headers[logic.alias];

    let mapValidity = false; // mapValidity false if there are unmapped headers
    if (Object.keys(tempUnmappedHeaders).length === 0) {
      mapValidity = checkValidity(tempCheck.flatQuestionnaire, tempMap.map);
    }

    _.set(tempMap.headersStructure, itemLocation, newLogic);
    this.setState({
      map: tempMap,
      unmappedHeaders: tempUnmappedHeaders,
      mapCheck: tempCheck,
      mapValidity,
    });
    pushMapBack(tempMap, mapValidity);
  }

  handleSaveLogicNode(logic) {
    const { map, mapValidity, unmappedHeaders } = this.state;
    const tempMap = JSON.parse(JSON.stringify(map));
    const tempUnmappedHeaders = JSON.parse(JSON.stringify(unmappedHeaders));
    const itemLocation = extractPathString(logic.itemPath);
    const existingLogic = _.get(tempMap.headersStructure, itemLocation);
    let newLogic = [];
    if (existingLogic !== undefined) {
      newLogic = existingLogic;
    }
    newLogic.push(logic);
    _.set(tempMap.headersStructure, itemLocation, newLogic);

    // update headers
    const headerId = _.get(
      tempMap.headersStructure,
      itemLocation.replace(/.logic$/, "")
    );
    const headerRegEx = new RegExp(`^${headerId.id}`);
    Object.keys(tempMap.map.headers).forEach((k) => {
      if (k.match(headerRegEx)) delete tempMap.map.headers[k];
    });
    tempMap.map.headers[logic.alias] = {};
    tempUnmappedHeaders[logic.alias] = {};

    this.setState({
      map: tempMap,
      logicMapNode: {},
      unmappedHeaders: tempUnmappedHeaders,
    });

    // need to add in logicLeaf and get rid of

    pushMapBack(tempMap, mapValidity);
  }

  handleValueMap(tempHeader, tempID) {
    this.setState({ editValueMap: true, header: tempHeader, mapID: tempID });
  }

  handleValueMapClose(event, choiceMap, header) {
    const { map, mapCheck, unmappedHeaders } = this.state;
    const tempMap = JSON.parse(JSON.stringify(map));

    tempMap.map.headers[header].choiceMap = choiceMap;
    let mapValidity = false; // assume false until proven otherwise
    if (Object.keys(unmappedHeaders).length === 0) {
      mapValidity = checkValidity(mapCheck.flatQuestionnaire, tempMap.map);
    }
    this.setState({
      editValueMap: false,
      map: tempMap,
      mapValidity,
    });
    pushMapBack(tempMap, mapValidity);
  }

  checkMapName(name) {
    if (name) {
      api.get(`api/maps/names/${encodeURI(name)}`).then((nameFound) => {
        this.setState({
          validName: !nameFound.uid,
          checking: false,
        });
      });
    } else {
      this.setState({ validName: false, checking: false });
    }
  }

  processCSV(csvText) {
    const { map, unmappedHeaders } = this.state;
    try {
      const columns = csvText.split(/\r\n|\n/)[0].split(",");
      let tempMap = JSON.parse(JSON.stringify(map));
      const originalMap = JSON.parse(JSON.stringify(tempMap));
      let tempUnmappedHeaders = JSON.parse(JSON.stringify(unmappedHeaders));
      const mapValidity = true;
      for (let i = 0; i < columns.length; i += 1) {
        ({ tempMap, tempUnmappedHeaders } = processAdd(
          tempMap,
          tempUnmappedHeaders,
          columns[i].trim(),
          [columns[i].trim()]
        ));
      }
      if (tempMap !== originalMap) {
        this.setState({ map: tempMap, unmappedHeaders: tempUnmappedHeaders });
        pushMapBack(tempMap, mapValidity);
      }
    } catch (e) {
      console.log(e);
      this.setState({ fileError: true });
    }
  }

  processJSON(jsonObj) {
    const { map, unmappedHeaders } = this.state;
    try {
      let obj = JSON.parse(jsonObj);
      if (Array.isArray(obj)) {
        [obj] = obj;
      }
      if (typeof obj !== "object") {
        throw new Error("File is not a valid JSON object");
      }

      let tempMap = JSON.parse(JSON.stringify(map));
      const originalMap = JSON.parse(JSON.stringify(tempMap));
      let tempUnmappedHeaders = JSON.parse(JSON.stringify(unmappedHeaders));
      const mapValidity = true;
      let headersStructure = [];
      // obj, path, itemPath, map, unmappedHeaders, headersStructureOriginal
      [tempMap, tempUnmappedHeaders, headersStructure] = parseJSON(
        obj,
        [],
        [],
        tempMap,
        tempUnmappedHeaders,
        headersStructure
      );
      if (tempMap !== originalMap) {
        tempMap.headersStructure = headersStructure;
        this.setState({ map: tempMap, unmappedHeaders: tempUnmappedHeaders });
        pushMapBack(tempMap, mapValidity);
      }
    } catch (e) {
      console.log(e);
      this.setState({ fileError: true });
    }
  }

  clearJSON() {
    const { map, mapCheck } = this.state;

    const tempMap = JSON.parse(JSON.stringify(map));
    const tempMapCheck = JSON.parse(JSON.stringify(mapCheck));
    tempMap.map.headers = {};
    delete tempMap.headersStructure;

    const tempUnmappedHeaders = [];
    const mapValidity = false;
    Object.keys(tempMapCheck.flatQuestionnaire).forEach((k) => {
      delete tempMapCheck.flatQuestionnaire[k].header;
    });

    this.setState({
      map: tempMap,
      unmappedHeaders: tempUnmappedHeaders,
      mapValidity,
      mapCheck: tempMapCheck,
    });
    pushMapBack(tempMap, mapValidity);
  }

  formatHeaders(currentMap) {
    const { map } = this.state;
    if (map.fileType === "json" && map.headersStructure) {
      return (
        <div className="jsonStructurePresentation">
          <Button
            variant="contained"
            style={stylesObj.resetSourceButton}
            onClick={() => {
              this.clearJSON();
            }}
          >
            Reset Source
            <DeleteForever />
          </Button>
          {Object.keys(map.headersStructure).length && (
            <TreeNav
              currentHeaders={map.map.headers}
              data={map.headersStructure}
              setNode={this.handleSetLogicNode}
              handleDeleteLogicLeaf={this.handleDeleteLogicLeaf}
            />
          )}
        </div>
      );
    }
    return Object.keys(currentMap.headers).map((k) => (
      <div key={`chip_${k}`}>
        <Chip
          label={k.length > 30 ? `${k.substring(0, 30)}...` : k}
          onDelete={() => {
            this.handleDelete(k);
          }}
          style={
            Object.prototype.hasOwnProperty.call(currentMap.headers[k], "path")
              ? stylesObj.mappedChip
              : stylesObj.unmappedChip
          }
          data-cy={`cy_chip_${k}`}
        />
      </div>
    ));
  }

  render() {
    const {
      checking,
      editingName,
      editValueMap,
      failedToLoad,
      fileError,
      header,
      headerUsed,
      loading,
      map,
      mapCheck,
      mapID,
      mapValidity,
      newHeaderName,
      questionnaire,
      tabChoice,
      tempName,
      unmappedHeaders,
      validName,
      logicMapNode,
    } = this.state;
    const { id } = this.props;
    return (
      <>
        {loading ? (
          <CircularProgress style={stylesObj.loaderStyling} />
        ) : (
          <>
            {failedToLoad ? (
              <>
                <Typography>{failedToLoad}</Typography>
              </>
            ) : (
              <>
                <div style={stylesObj.themePadding}>
                  {Object.keys(logicMapNode).length !== 0 && (
                    <LogicMapDialog
                      handleClose={this.handleClearLogicNode}
                      handleSave={this.handleSaveLogicNode}
                      node={logicMapNode}
                    />
                  )}
                  {editValueMap && (
                    <ValueMapCard
                      map={map}
                      header={header}
                      onValueMapClose={this.handleValueMapClose}
                      mapCheck={mapCheck}
                      mapID={mapID}
                    />
                  )}
                  {!editValueMap && mapValidity !== undefined && (
                    <Grid
                      container
                      className={stylesObj.flexGrow}
                      wrap="nowrap"
                      spacing={2}
                    >
                      <Grid item xs={3} style={stylesObj.gridWidth}>
                        <Card style={stylesObj.sideCard} wrap="wrap">
                          <div style={stylesObj.themePadding}>
                            <Typography variant="h6">
                              <span style={stylesObj.textBold}>Map name: </span>

                              {!editingName && (
                                <>
                                  <span>{map.name}</span>
                                  <IconButton
                                    edge="start"
                                    aria-label="menu"
                                    onClick={this.handleEditMapName}
                                    style={stylesObj.nameEditIcon}
                                  >
                                    <Edit />
                                  </IconButton>
                                </>
                              )}
                              {editingName && (
                                <>
                                  <TextField
                                    style={stylesObj.addHeaderText}
                                    id="name_editedValue"
                                    value={tempName}
                                    margin="normal"
                                    onChange={this.handleMapNameChange}
                                  />
                                  <IconButton
                                    edge="start"
                                    aria-label="menu"
                                    onClick={this.handleEditMapName}
                                    style={stylesObj.nameEditIcon}
                                    disabled={!validName || checking}
                                  >
                                    <Save />
                                  </IconButton>
                                  {!validName && (
                                    <Typography
                                      variant="body1"
                                      style={stylesObj.invalidName}
                                    >
                                      Invalid Name
                                    </Typography>
                                  )}
                                </>
                              )}
                            </Typography>
                            <Typography variant="body1">
                              <span style={stylesObj.textBold}>
                                Questionnaire:&nbsp;
                              </span>
                              {questionnaire.resource.name}
                            </Typography>
                            <Typography
                              variant="body1"
                              style={stylesObj.mapTextEnd}
                            >
                              <span style={stylesObj.textBold}>
                                file type:&nbsp;
                              </span>
                              {map.fileType}
                            </Typography>
                            <Typography variant="h6">
                              <span style={stylesObj.textBold}>
                                {map.fileType === "csv"
                                  ? "Source Headers"
                                  : "Source Structure"}
                              </span>
                            </Typography>
                            <UploadSource
                              fileError={fileError}
                              fileType={map.fileType || "csv"}
                              handleAdd={this.handleAdd}
                              handleMapUpload={this.handleMapUpload}
                              handleNameChange={this.handleNameChange}
                              handleTabChange={this.handleTabChange}
                              handleUpload={this.handleUpload}
                              headerUsed={headerUsed}
                              id={id}
                              newHeaderName={newHeaderName}
                              tabChoice={tabChoice}
                            />
                            <br />
                            {map.map && (
                              <div>{this.formatHeaders(map.map, this)}</div>
                            )}
                          </div>
                        </Card>
                      </Grid>
                      <Grid item xs>
                        <EditCard
                          mapCheck={mapCheck}
                          map={map}
                          onAssociation={this.handleAssociationChangeHeader}
                          constantChange={this.handleConstantChange}
                          onValueMap={this.handleValueMap}
                          unmappedHeaders={unmappedHeaders}
                          mapValidity={mapValidity}
                        />
                      </Grid>
                    </Grid>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </>
    );
  }
}

MapEdit.propTypes = {
  id: PropTypes.string.isRequired,
};

export default MapEdit;
