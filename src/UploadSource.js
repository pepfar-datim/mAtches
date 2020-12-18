import React, { useState } from "react";
import {
  Typography,
  IconButton,
  TextField,
  Tabs,
  Tab,
} from "@material-ui/core";

import {
  AddCircleOutlined,
  Publish,
  ImageSearch,
  Edit,
  Save,
} from "@material-ui/icons";
import { stylesObj } from "./styling/stylesObj.js";

import UploadMapList from "./UploadMapList.js";

function a11yProps(index) {
  return {
    id: `scrollable-prevent-tab-${index}`,
    "aria-controls": `scrollable-prevent-tabpanel-${index}`,
  };
}

export default function UploadSource(props) {
  let targetForm = "";

  const isInteractionHidden = (csvIndex, jsonIndex) => {
    if (props.fileType == "csv") {
      return props.tabChoice != csvIndex;
    } else {
      return props.tabChoice != jsonIndex;
    }
  };

  return (
    <div>
      <div style={stylesObj.whiteBackground}>
        <Tabs
          value={props.tabChoice}
          onChange={props.handleTabChange}
          style={stylesObj.mappingBoxBanner}
          TabIndicatorProps={{
            style: stylesObj.tabIndicator,
          }}
        >
          {props.fileType == "csv" && (
            <Tab
              style={stylesObj.minWidth}
              icon={<AddCircleOutlined />}
              aria-label="add"
              {...a11yProps(0)}
            />
          )}
          <Tab
            style={stylesObj.minWidth}
            icon={<Publish />}
            aria-label="upload"
            {...a11yProps(1)}
          />
          {props.fileType == "csv" && (
            <Tab
              style={stylesObj.minWidth}
              icon={<ImageSearch />}
              aria-label="fromMap"
              {...a11yProps(2)}
            />
          )}
        </Tabs>
        <div hidden={isInteractionHidden(0, undefined)}>
          <TextField
            style={stylesObj.addHeaderText}
            id="add_header"
            label="Add a Header"
            value={props.newHeaderName}
            margin="normal"
            onChange={(e) => props.handleNameChange(e)}
            data-cy="addHeaderInput"
          />
          <br />
          <IconButton
            edge="start"
            aria-label="menu"
            onClick={() => props.handleAdd()}
            data-cy="addHeaderButton"
          >
            <AddCircleOutlined />
          </IconButton>
          {props.headerUsed && (
            <Typography variant="body1" style={stylesObj.errorText}>
              Header has already been used
            </Typography>
          )}
        </div>
        <div hidden={isInteractionHidden(1, 0)}>
          <Typography variant="body1">
            {"Upload Headers from " + props.fileType.toUpperCase()}
          </Typography>
          <TextField disabled={true} label="" value="" />
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={(e) => targetForm.click()}
          >
            <Publish />
          </IconButton>
          <form style={stylesObj.hidden}>
            <input
              type="file"
              ref={(form) => {
                targetForm = form;
              }}
              accept={"." + props.fileType}
              onChange={(ev) => props.handleUpload(ev)}
            />
          </form>
          {props.fileError && (
            <Typography variant="body1" style={stylesObj.errorText}>
              {"Invalid " + props.fileType + " file"}
            </Typography>
          )}
          <br />
        </div>
        <div hidden={isInteractionHidden(2, undefined)}>
          <UploadMapList onMapProcess={props.handleMapUpload} id={props.id} />
        </div>
      </div>
      <br />
    </div>
  );
}
