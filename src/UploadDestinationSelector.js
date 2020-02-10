import React from "react";

import {Radio, RadioGroup, FormControlLabel, TextField} from "@material-ui/core";

import {stylesObj} from './styling/stylesObj.js';

import config from '../config.json'

function UploadDestinationSelector(props) {
	return (
		<div>
			<RadioGroup 
				style ={stylesObj.uploadDestinationRadioGroup}
				aria-label="destination"
				name="destinationSelector"
				value={props.destination}
				onChange={e => props.onDestinationChange(e.target.value)}
				row
			>
				<FormControlLabel
					value="internal"
					control={<Radio style={stylesObj.uploadDestinationRadio}/>}
					label={"Output generated FHIR bundle in " + config.appName}
				/>
				<FormControlLabel
					value="external"
					control={<Radio style={stylesObj.uploadDestinationRadio} />}
					label="Send generated FHIR bundle to external URL"
				/>
			</RadioGroup>
			{props.destination == 'external' &&
				<div>
		          <TextField
		            style={stylesObj.uploadDestinationText}
		            id="url-name"
		            label="URL"
		            value={props.externalURL}
		            onChange={e => props.onURLChange(e.target.value)}
		          />
				</div>

			}
		</div>
	);
}

export default UploadDestinationSelector;