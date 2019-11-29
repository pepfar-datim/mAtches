import React from "react";
import csv from "csv";

import getMuiTheme from "material-ui/styles/getMuiTheme";

import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepButton from "@material-ui/core/StepButton";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import config from "../config.json";
import flattenValuesMap from "./services/flattenValuesMap.js";
import { uploadFile, checkHeadersGeneral } from "./services/validateFile.js";


function getSteps() {
	return [
		"Download template",
		"Fill out template",
		"Upload completed template"
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
			activeStep: 0
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
				console.log("download csv");
				//this.handleDownload();
				break;
			case 1:
				console.log("do nothing");
				break;
			case 2:
				console.log("upload csv");
                this.uploadAction(e);
				break;
		}
		this.setState({
			activeStep: Math.min(
				this.state.activeStep + 1,
				getSteps().length - 1
			)
		});
	}

	uploadAction(e) {
		document.getElementById('uploadClick').click(e);
	}

	upload(e) {
		e.preventDefault();
		uploadFile(e, this).then(csvFile => {
			console.log('got a file');		
			this.uploadCallback(csvFile);
		});
	}

	uploadCallback(csvText) {
		var headersCheck = checkHeadersGeneral(csvText.split("\n")[0].split(","), ['Target', 'Source']);
		console.log(JSON.stringify(headersCheck));
		if (headersCheck.valid) {
			console.log('send server side');
			//api/maps/:id/upload/valueMap/:header
			fetch(
				config.base +
					"api/maps/" +
					this.props.uid +
					"/upload/valueMap/" +
					this.props.header,
				{
					method: "POST",
					body: csvText,
					headers: { "Content-Type": "text/plain; charset=UTF-8" }
				}
			)
			.then(results => results.json())
			.then(response => {	
				console.log(response);
			})
			
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
					<Stepper
						activeStep={this.state.activeStep}
						orientation="vertical"
					>
						{steps.map((label, index) => (
							<Step key={label}>
								<StepLabel
									StepIconProps={{ color: "lightSteelBlue" }}
								>
									{label}
								</StepLabel>

								<StepContent>
									<Typography>
										{getStepContent(index)}
									</Typography>
									<div>
										<div>
											<Button
												disabled={
													this.state.activeStep === 0
												}
												onClick={this.handleBack}
											>
												Back
											</Button>
											<Button
												variant="contained"
												color="primary"
												onClick={e => this.handleNext(e)}
												style={{
													backgroundColor:
														"lightSteelBlue"
												}}
											>
												{
													["Download", "Next", "Upload"][this.state.activeStep]
												}
											</Button>
											<form style={{ visibility: "hidden" }}>
												<input
													type="file"
													id="uploadClick"
													accept=".csv"
													onChange={e => {
														this.upload(e);
													}}
												/>
											</form>
										</div>
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