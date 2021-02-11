import React, { Component } from "react";
import PropTypes from "prop-types";

import csv from "csv";

import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

import api from "../services/api";
import flattenValuesMap from "../services/flattenValuesMap";
import { uploadFile, checkHeadersGeneral } from "../services/validateFile";

import { stylesObj } from "../styling/stylesObj";

const getSteps = () => [
  "Download template",
  "Fill out template",
  "Upload completed template",
];

const getStepContent = (step) => {
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
};

class ValueMapUploadDialog extends Component {
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
    const { header, valueSet } = this.props;
    const tempValueSet = JSON.parse(JSON.stringify(valueSet));
    const flatCSV = flattenValuesMap(tempValueSet);
    try {
      csv.stringify(flatCSV, (err, output) => {
        const data = new Blob([output], { type: "text/csv" });
        const csvURL = window.URL.createObjectURL(data);
        const tempLink = document.createElement("a");
        tempLink.href = csvURL;
        tempLink.setAttribute("download", `${header}_valueMapTemplate`);
        tempLink.click();
      });
    } catch (e) {
      console.error(e);
    }
  }

  handleBack() {
    const { activeStep } = this.state;
    this.setState({ activeStep: Math.max(activeStep - 1, 0) });
  }

  handleNext(e) {
    const { activeStep } = this.state;

    switch (activeStep) {
      case 0:
        this.handleDownload();
        break;
      case 1:
        break;
      case 2:
        this.uploadAction(e);
        break;
      default:
        break;
    }
    this.setState({
      activeStep: Math.min(activeStep + 1, getSteps().length - 1),
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
    const { handleValueMapUpdate, header, valueSet, uid } = this.props;
    const headersCheck = checkHeadersGeneral(
      csvText.split("\n")[0].split(","),
      ["Target", "Source"]
    );
    if (headersCheck.valid) {
      const postObject = {
        csvText,
        valueSet: JSON.parse(JSON.stringify(valueSet)),
      };
      api
        .post(`api/maps/${uid}/upload/valueMap/${header}`, postObject)
        .then((response) => {
          if (response.valid) {
            this.setState({ duplicateMappings: [], invalidMappings: [] });
            handleValueMapUpdate(response.valueSet, response.choiceMap);
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
    const { onClose, open } = this.props;
    const { activeStep, duplicateMappings, invalidMappings } = this.state;
    const steps = getSteps();

    return (
      <Dialog maxWidth="md" fullWidth open={open} onClose={onClose}>
        <DialogTitle>
          <strong>Upload Values Map</strong>
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} orientation="vertical">
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
                        disabled={activeStep === 0}
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
                        {["Download", "Next", "Upload"][activeStep]}
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
                    {(duplicateMappings.length > 0 ||
                      invalidMappings.length > 0) && (
                      <Typography color="error">
                        ERROR: Review the below errors with your Value Map
                        Upload, fix, and reload
                      </Typography>
                    )}
                    {duplicateMappings.length > 0 && (
                      <Typography color="error">
                        The following mappings have been mapped to more than one
                        Target value:
                        <br />
                        {duplicateMappings.join(", ")}
                      </Typography>
                    )}
                    {invalidMappings.length > 0 && (
                      <Typography color="error">
                        The following items in the Target Column are Invalid:
                        <br />
                        {invalidMappings.join(", ")}
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

export default ValueMapUploadDialog;

ValueMapUploadDialog.propTypes = {
  handleValueMapUpdate: PropTypes.func.isRequired,
  header: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  uid: PropTypes.string.isRequired,
  valueSet: PropTypes.objectOf(PropTypes.object).isRequired,
};
