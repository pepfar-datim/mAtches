import React from "react";
import {Card, Typography, IconButton, TextField, InputLabel, MenuItem, FormHelperText, FormControl, Select, Button} from '@material-ui/core';

import PublishIcon from '@material-ui/icons/Publish';
import MapIcon from '@material-ui/icons/Map';

import config from '../config.json'

import {stylesObj} from './styling/stylesObj.js';

function handleChange(event) {
	console.log(event)
}

function formatMenuItems(currentMap) {
 	return Object.keys(currentMap).map(function (k, i) {
		return(
			  <MenuItem value={k}>{k}</MenuItem>
		)	
	})

}

function formatSelect(header,key,map,associationFunction) {
    return(
		<FormControl style={stylesObj.editCardSelector}>
		<Select
		  value={header || ''}
		  onChange={associationFunction}
		  name={key}
		>
			{formatMenuItems(map)}
		</Select>
		</FormControl> 
    )
}

function formatQuestions(mapCheck,map, associationFunction, valueMapFunction) {
  return Object.keys(mapCheck.flatQuestionnaire).map(function (k, i) {
    return(
      <div key={'question-'+i} style={stylesObj.editCardSelectorPadding}>
        <Typography wrap="noWrap">
          <strong>{mapCheck.flatQuestionnaire[k].text}</strong>
        </Typography>
		{formatSelect(mapCheck.flatQuestionnaire[k].header,k,map,associationFunction)}
		<br />
		{(mapCheck.flatQuestionnaire[k].valueType == 'choice') &&
			<Button 
				variant="contained" 
				style={stylesObj.editCardSelectorButton}
				onClick={() => { valueMapFunction(mapCheck.flatQuestionnaire[k].header,k)}}
				disabled={!mapCheck.flatQuestionnaire[k].hasOwnProperty('header')}
			>
			Map values
			<MapIcon style={stylesObj.editCardSelectorButtonIcon} />			
			</Button>

		}
      </div>

    )
  })  
}

class EditCard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

redirectToUpload () {
	window.location = config.base + 'maps/' + this.props.map.uid + '?mode=upload'
}
	
	render() {
		var buttonDisabled = Object.keys(this.props.unmappedHeaders).length > 0 || !this.props.mapValidity;
		var buttonUploadStyling = buttonDisabled ? stylesObj.editCardUploadButtonDisabled : stylesObj.editCardUploadButtonEnabled
		return(
	      	<Card style={stylesObj.editCard}>
	        	<div style={stylesObj.themePadding}>
	          		<Typography variant="h6" style={stylesObj.marginQuarterBottom}>
	            		<strong>Map Source Headers to Target Questions</strong>
	          		</Typography>
	          		<div style={stylesObj.themePaddingQuarter}>
	                {this.props.mapCheck && this.props.map &&
	                <div>
	                  {formatQuestions(this.props.mapCheck, this.props.map.map, this.props.onAssociation, this.props.onValueMap)}
	                </div>

	                }  
	          		</div>
	        	</div>
					<div>
					<Button variant="contained" style={buttonUploadStyling}
						onClick={this.redirectToUpload.bind(this)}
						disabled={buttonDisabled}
					>
					Upload Data
					<PublishIcon style={stylesObj.marginQuarter} />
					</Button>			
					</div>   	        	            
			</Card>
		);
	}
}

export default EditCard;
