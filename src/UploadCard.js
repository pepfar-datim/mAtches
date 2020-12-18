import React from "react";
import { Card, Typography, IconButton, TextField } from "@material-ui/core";

import PublishIcon from "@material-ui/icons/Publish";

import ValidationCard from "./ValidationCard.js";
import UploadDestinationSelector from "./UploadDestinationSelector.js";

import api from "./services/api.js";

import { uploadFile, checkHeaders } from "./services/validateFile.js";

import { stylesObj } from "./styling/stylesObj.js";

import config from "../config.json";

class UploadCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileName: "",
      destination: "internal",
      externalURL: "",
    };
    this.handleDestinationChange = this.handleDestinationChange.bind(this);
    this.handleURLChange = this.handleURLChange.bind(this);
  }
  setInitialState() {
    this.setState({
      finishedUploading: false,
      data: { resourceType: undefined },
      errors: {},
      invalidHeaders: [],
      missingHeaders: [],
      urlResponse: {},
    });
  }
  handleDestinationChange(text) {
    this.setState({ destination: text });
  }
  handleURLChange(text) {
    this.setState({ externalURL: text });
  }
  uploadAction(e) {
    this.refs.fileInput.click(e);
  }

  uploadCallback(dataFile) {
    let dataSummary = {};

    switch (this.props.map.fileType) {
      case "json":
        dataSummary = {
          validity: true,
          invalidHeaders: [],
          missingHeaders: [],
          text: dataFile,
        };
        break;
      default:
        dataSummary = checkHeaders(
          dataFile,
          JSON.parse(JSON.stringify(this.props.map.map.headers))
        );
        break;
    }
    this.setState({
      invalidHeaders: dataSummary.invalidHeaders,
      missingHeaders: dataSummary.missingHeaders,
    });
    if (dataSummary.validity) {
      var url =
        this.state.destination == "external"
          ? encodeURIComponent(this.state.externalURL)
          : null;
      api
        .postCSV(
          "api/maps/" + this.props.map.uid + "/upload?url=" + url,
          dataSummary.text
        )
        .then((response) => {
          if (response.hasOwnProperty("errors")) {
            this.setState({ errors: response.errors });
          }
          if (response.hasOwnProperty("data")) {
            this.setState({ data: response.data });
          }
          if (response.hasOwnProperty("urlResponse")) {
            this.setState({ urlResponse: response.urlResponse });
          }
          this.setState({ finishedUploading: true });
        });
    } else {
      this.setState({
        finishedUploading: true,
        invalidHeaders: dataSummary.invalidHeaders,
        missingHeaders: dataSummary.missingHeaders,
      });
    }
  }

  upload(e) {
    e.preventDefault();
    this.setInitialState();
    uploadFile(e, this).then((dataFile) => {
      if (!dataFile) {
        this.setState({ fileName: "" });
      }
      this.uploadCallback(dataFile);
    });
  }

  render() {
    return (
      <Card style={stylesObj.mainCard}>
        <div style={stylesObj.themePadding}>
          <Typography variant="h6">
            <strong>Upload Data</strong>
          </Typography>
          {config.allowExternalURL && (
            <UploadDestinationSelector
              destination={this.state.destination}
              externalURL={this.state.externalURL}
              onDestinationChange={this.handleDestinationChange}
              onURLChange={this.handleURLChange}
            />
          )}
          <div style={stylesObj.themePaddingQuarter}>
            <Typography variant="body1">
              Select a {(this.props.map.fileType || "CSV").toUpperCase()} file
              to upload
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
              onClick={(e) => {
                this.uploadAction(e);
              }}
            >
              <PublishIcon />
            </IconButton>
            <form style={stylesObj.hidden}>
              <input
                type="file"
                ref="fileInput"
                accept={"." + (this.props.map.fileType || "csv")}
                onChange={(ev) => {
                  this.upload(ev);
                }}
              />
            </form>
            {this.state.finishedUploading && (
              <ValidationCard
                errors={this.state.errors}
                invalidHeaders={this.state.invalidHeaders}
                missingHeaders={this.state.missingHeaders}
                success={this.state.data.resourceType == "Bundle"}
                data={this.state.data}
                urlResponse={this.state.urlResponse}
              />
            )}
          </div>
        </div>
      </Card>
    );
  }
}

export default UploadCard;
