import React from "react";

import getMuiTheme from 'material-ui/styles/getMuiTheme'

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepButton from '@material-ui/core/StepButton';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import flattenValuesMap from "./services/flattenValuesMap.js";

function getSteps() {
  return ['Download template', 'Fill out template', 'Upload completed template'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return 'First, download a CSV copy of template that contains all of your existing mappings';
    case 1:
      return 'Populate (offline) the template that you downloaded in Step 1. Names in the target columns may not be altered (except for deleting or duplicating rows)';
    case 2:
      return 'Load back the template (in CSV format)';
    default:
      return 'Unknown step';
  }
}

class ValueMapUploadDialogue extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			activeStep: 0,
		};
		this.handleBack = this.handleBack.bind(this);
		this.handleNext = this.handleNext.bind(this);
	}

	handleDownload() {
		var tempValueSet = JSON.parse(JSON.stringify(this.props.valueSet));
		var flatCSV = flattenValuesMap(tempValueSet);
		console.log(JSON.stringify(flatCSV));
	}

	handleBack() {
		this.setState({activeStep: Math.max(this.state.activeStep - 1, 0)})
	}

	handleNext() {
		var currentStep = this.state.activeStep;
		switch (this.state.activeStep) {
			case 0:
				console.log('download csv');
				this.handleDownload();
				break;
			case 1:
				console.log('do nothing')
				break;
			case 2:
				console.log('upload csv')
				break;
		}
		this.setState({activeStep: Math.min(this.state.activeStep + 1, getSteps().length -1)})
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
	      		<DialogTitle><strong>Upload Values Map</strong></DialogTitle>
	      		<DialogContent>
			      <Stepper activeStep={this.state.activeStep} orientation="vertical">
			        {steps.map((label, index) => (
			          <Step key={label}>
			            
			            	<StepLabel
			            		StepIconProps={{color: "lightSteelBlue"}}
			            	>
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
			                    onClick={this.handleNext}
								style={{backgroundColor: "lightSteelBlue"}} 
			                  >
			                    {['Download', 'Next', 'Upload'][this.state.activeStep]}
			                  </Button>
			                </div>
			              </div>
			            </StepContent>

			          </Step>
			        ))}
			      </Stepper>	      			
	      		</DialogContent>
	      	</Dialog>
		)
	}
}

export default ValueMapUploadDialogue;
