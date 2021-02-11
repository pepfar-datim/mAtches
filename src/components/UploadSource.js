import React from "react";
import PropTypes from "prop-types";

import {
  Typography,
  IconButton,
  TextField,
  Tabs,
  Tab,
} from "@material-ui/core";

import { AddCircleOutlined, Publish, ImageSearch } from "@material-ui/icons";
import { stylesObj } from "../styling/stylesObj";

import UploadMapList from "./UploadMapList";

function a11yProps(index) {
  return {
    id: `scrollable-prevent-tab-${index}`,
    "aria-controls": `scrollable-prevent-tabpanel-${index}`,
  };
}

export default function UploadSource(props) {
  const {
    fileError,
    fileType,
    handleAdd,
    handleMapUpload,
    handleNameChange,
    handleTabChange,
    handleUpload,
    headerUsed,
    id,
    newHeaderName,
    tabChoice,
  } = props;
  let targetForm = "";

  const isInteractionHidden = (csvIndex, jsonIndex) => {
    if (fileType === "csv") {
      return tabChoice !== csvIndex;
    }
    return tabChoice !== jsonIndex;
  };

  return (
    <div>
      <div style={stylesObj.whiteBackground}>
        <Tabs
          value={tabChoice}
          onChange={handleTabChange}
          style={stylesObj.mappingBoxBanner}
          TabIndicatorProps={{
            style: stylesObj.tabIndicator,
          }}
        >
          {fileType === "csv" && (
            <Tab
              style={stylesObj.minWidth}
              icon={<AddCircleOutlined />}
              aria-label="add"
              id={a11yProps(0).id}
              aria-controls={a11yProps(0)["aria-controls"]}
            />
          )}
          <Tab
            style={stylesObj.minWidth}
            icon={<Publish />}
            aria-label="upload"
            id={a11yProps(1).id}
            aria-controls={a11yProps(1)["aria-controls"]}
          />
          {fileType === "csv" && (
            <Tab
              style={stylesObj.minWidth}
              icon={<ImageSearch />}
              aria-label="fromMap"
              id={a11yProps(2).id}
              aria-controls={a11yProps(2)["aria-controls"]}
            />
          )}
        </Tabs>
        <div hidden={isInteractionHidden(0, undefined)}>
          <TextField
            style={stylesObj.addHeaderText}
            id="add_header"
            label="Add a Header"
            value={newHeaderName}
            margin="normal"
            onChange={(e) => handleNameChange(e)}
            data-cy="addHeaderInput"
          />
          <br />
          <IconButton
            edge="start"
            aria-label="menu"
            onClick={() => handleAdd()}
            data-cy="addHeaderButton"
          >
            <AddCircleOutlined />
          </IconButton>
          {headerUsed && (
            <Typography variant="body1" style={stylesObj.errorText}>
              Header has already been used
            </Typography>
          )}
        </div>
        <div hidden={isInteractionHidden(1, 0)}>
          <Typography variant="body1">
            {`Upload Headers from ${fileType.toUpperCase()}`}
          </Typography>
          <TextField disabled label="" value="" />
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => targetForm.click()}
          >
            <Publish />
          </IconButton>
          <form style={stylesObj.hidden}>
            <input
              type="file"
              ref={(form) => {
                targetForm = form;
              }}
              accept={`.${fileType}`}
              onChange={(ev) => handleUpload(ev)}
            />
          </form>
          {fileError && (
            <Typography variant="body1" style={stylesObj.errorText}>
              {`Invalid ${fileType} file`}
            </Typography>
          )}
          <br />
        </div>
        <div hidden={isInteractionHidden(2, undefined)}>
          <UploadMapList onMapProcess={handleMapUpload} id={id} />
        </div>
      </div>
      <br />
    </div>
  );
}

UploadSource.propTypes = {
  fileError: PropTypes.bool.isRequired,
  fileType: PropTypes.string.isRequired,
  handleAdd: PropTypes.func.isRequired,
  handleMapUpload: PropTypes.func.isRequired,
  handleNameChange: PropTypes.func.isRequired,
  handleTabChange: PropTypes.func.isRequired,
  handleUpload: PropTypes.func.isRequired,
  headerUsed: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  newHeaderName: PropTypes.string.isRequired,
  tabChoice: PropTypes.number.isRequired,
};
