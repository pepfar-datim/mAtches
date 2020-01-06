import React from "react";

import {Radio, RadioGroup, FormControlLabel, TextField} from "@material-ui/core";

function UploadDestinationSelector(props) {
	return (
		<div>
			<RadioGroup 
				style ={{
					padding: '5px',
					marginLeft: '10px'
				}}
				aria-label="destination"
				name="destinationSelector"
				value={props.destination}
				onChange={e => props.onDestinationChange(e.target.value)}
				row
			>
				<FormControlLabel
					value="internal"
					control={<Radio style={{color: "black"}}/>}
					label="Output generated FHIR bundle in mAppr"
				/>
				<FormControlLabel
					value="external"
					control={<Radio style={{color: "black"}} />}
					label="Send generated FHIR bundle to external URL"
				/>
			</RadioGroup>
			{props.destination == 'external' &&
				<div>
		          <TextField
		            style={{width:'600px', marginBottom: "20px"}}
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