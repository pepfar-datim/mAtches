import React from "react";
import PropTypes from "prop-types";

import { Card, Typography, IconButton, TextField } from "@material-ui/core";

import PublishIcon from "@material-ui/icons/Publish";

import ValidationCard from "./ValidationCard";
import UploadDestinationSelector from "./UploadDestinationSelector";

import api from "../services/api";

import { uploadFile, checkHeaders } from "../services/validateFile";

import { stylesObj } from "../styling/stylesObj";

import config from "../../config.json";

class UploadCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileName: "",
      readyToLoad: true,
      destination: "internal",
      externalURL: "",
    };
    this.handleDestinationChange = this.handleDestinationChange.bind(this);
    this.handleURLChange = this.handleURLChange.bind(this);
  }

  handleDestinationChange(text) {
    this.setState({ destination: text });
  }

  handleURLChange(text) {
    this.setState({ externalURL: text });
  }

  setInitialState() {
    this.setState({
      finishedUploading: false,
      readyToLoad: true,
      data: { resourceType: undefined },
      errors: {},
      invalidHeaders: [],
      missingHeaders: [],
      urlResponse: {},
    });
  }

  uploadCallback(dataFile) {
    this.setState({readyToLoad: false})
    const { map } = this.props;
    const { destination, externalURL } = this.state;
    let dataSummary = {};

    switch (map.fileType) {
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
          JSON.parse(JSON.stringify(map.map.headers))
        );
        break;
    }
    this.setState({
      invalidHeaders: dataSummary.invalidHeaders,
      missingHeaders: dataSummary.missingHeaders,
    });
    if (dataSummary.validity) {
      const url =
        destination === "external" ? encodeURIComponent(externalURL) : null;
      api
        .postCSV(`api/maps/${map.uid}/upload?url=${url}`, dataSummary.text)
        .then((response) => {
          if (response.errors) {
            this.setState({ errors: response.errors });
          }
          if (response.data) {
            this.setState({ data: response.data });
          }
          if (response.urlResponse) {
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
    this.setState({ readyToLoad: true });
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
    let targetForm = "";
    const { map } = this.props;
    const {
      data,
      destination,
      errors,
      externalURL,
      fileName,
      finishedUploading,
      invalidHeaders,
      missingHeaders,
      urlResponse,
    } = this.state;
    return (
      <Card style={stylesObj.mainCard}>
        <div style={stylesObj.themePadding}>
          <Typography variant="h6">
            <strong>Upload Data</strong>
          </Typography>
          {config.allowExternalURL && (
            <UploadDestinationSelector
              destination={destination}
              externalURL={externalURL}
              onDestinationChange={this.handleDestinationChange}
              onURLChange={this.handleURLChange}
            />
          )}
          <div style={stylesObj.themePaddingQuarter}>
            <Typography variant="body1">
              {`Select a ${map.fileType.toUpperCase() || "CSV"} file to upload`}
            </Typography>
            <TextField disabled label={fileName} value={fileName} />
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => targetForm.click()}
            >
              <PublishIcon />
            </IconButton>
            {this.state.readyToLoad &&
              (
              <form style={stylesObj.hidden}>
                <input
                  type="file"
                  accept={`.${map.fileType || "csv"}`}
                  ref={(form) => {
                    targetForm = form;
                  }}
                  name={this.state.fileName}
                  onChange={(ev) => {
                    this.upload(ev);
                  }}
                />
              </form>
              )
            }
            {finishedUploading && (
              <ValidationCard
                errors={errors}
                invalidHeaders={invalidHeaders}
                missingHeaders={missingHeaders}
                success={data.resourceType === "Bundle"}
                data={data}
                urlResponse={urlResponse}
              />
            )}
          </div>
        </div>
      </Card>
    );
  }
}

UploadCard.propTypes = {
  map: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default UploadCard;
