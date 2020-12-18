import React from "react";
import csv from "csv";

import {
  Stepper,
  Step,
  StepLabel,
  StepButton,
  StepContent,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

import api from "./services/api.js";
import flattenValuesMap from "./services/flattenValuesMap.js";
import { uploadFile, checkHeadersGeneral } from "./services/validateFile.js";

import { stylesObj } from "./styling/stylesObj.js";

function getSteps() {
  return [
    "Download template",
    "Fill out template",
    "Upload completed template",
  ];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return "First, download a CSV copy of template that contains all of your existing mappings";
    case 1:
      return "Fill out the the CSV file that has just downloaded in your browser.  Names in the target columns may not be altered (except for deleting or duplicating rows)";
    case 2:
      return "Load back the template (in CSV format)";
    default:
      return "Unknown step";
  }
}

class ValueMapUploadDialogue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      duplicateMappings: [],
      invalidMappings: [],
    };
    this.handleBack = this.handleBack.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }

  handleDownload() {
    var tempValueSet = JSON.parse(JSON.stringify(this.props.valueSet));
    var flatCSV = flattenValuesMap(tempValueSet);
    try {
      csv.stringify(flatCSV, (err, output) => {
        var data = new Blob([output], { type: "text/csv" });
        var csvURL = window.URL.createObjectURL(data);
        let tempLink = document.createElement("a");
        tempLink.href = csvURL;
        tempLink.setAttribute(
          "download",
          this.props.header + "_valueMapTemplate"
        );
        tempLink.click();
      });
    } catch (e) {
      console.error(e);
    }
  }

  handleBack() {
    this.setState({ activeStep: Math.max(this.state.activeStep - 1, 0) });
  }

  handleNext(e) {
    var currentStep = this.state.activeStep;
    switch (this.state.activeStep) {
      case 0:
        this.handleDownload();
        break;
      case 1:
        break;
      case 2:
        this.uploadAction(e);
        break;
    }
    this.setState({
      activeStep: Math.min(this.state.activeStep + 1, getSteps().length - 1),
    });
  }

  uploadAction(e) {
    document.getElementById("uploadClick").click(e);
  }

  upload(e) {
    e.preventDefault();
    uploadFile(e, this).then((csvFile) => {
      this.uploadCallback(csvFile);
    });
  }

  uploadCallback(csvText) {
    var headersCheck = checkHeadersGeneral(csvText.split("\n")[0].split(","), [
      "Target",
      "Source",
    ]);
    if (headersCheck.valid) {
      var postObject = {
        csvText: csvText,
        valueSet: JSON.parse(JSON.stringify(this.props.valueSet)),
      };
      api
        .post(
          "api/maps/" +
            this.props.uid +
            "/upload/valueMap/" +
            this.props.header,
          postObject
        )
        .then((response) => {
          if (response.valid) {
            this.setState({ duplicateMappings: [], invalidMappings: [] });
            this.props.handleValueMapUpdate(
              response.valueSet,
              response.choiceMap
            );
          } else {
            this.setState({
              duplicateMappings: response.duplicateMappings,
              invalidMappings: response.invalidMappings,
            });
          }
        });
    }
  }

  render() {
    const steps = getSteps();

    return (
      <Dialog
        maxWidth={"md"}
        fullWidth={true}
        open={this.props.open}
        onClose={this.props.onClose}
      >
        <DialogTitle>
          <strong>Upload Values Map</strong>
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={this.state.activeStep} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel style={stylesObj.valueMapUploadStepLabel}>
                  {label}
                </StepLabel>

                <StepContent>
                  <Typography>{getStepContent(index)}</Typography>
                  <div>
                    <div>
                      <Button
                        disabled={this.state.activeStep === 0}
                        onClick={this.handleBack}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={(e) => this.handleNext(e)}
                        style={stylesObj.valueMapUploadButton}
                      >
                        {["Download", "Next", "Upload"][this.state.activeStep]}
                      </Button>
                      <form style={stylesObj.hidden}>
                        <input
                          type="file"
                          id="uploadClick"
                          accept=".csv"
                          onChange={(e) => {
                            this.upload(e);
                          }}
                        />
                      </form>
                    </div>
                    {(this.state.duplicateMappings.length > 0 ||
                      this.state.invalidMappings.length > 0) && (
                      <Typography color="error">
                        ERROR: Review the below errors with your Value Map
                        Upload, fix, and reload
                      </Typography>
                    )}
                    {this.state.duplicateMappings.length > 0 && (
                      <Typography color="error">
                        The following mappings have been mapped to more than one
                        Target value:
                        <br />
                        {this.state.duplicateMappings.join(", ")}
                      </Typography>
                    )}
                    {this.state.invalidMappings.length > 0 && (
                      <Typography color="error">
                        The following items in the Target Column are Invalid:
                        <br />
                        {this.state.invalidMappings.join(", ")}
                      </Typography>
                    )}
                  </div>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </DialogContent>
      </Dialog>
    );
  }
}

export default ValueMapUploadDialogue;
