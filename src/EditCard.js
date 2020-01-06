import React from "react";
import {Card, Typography, IconButton, TextField, InputLabel, MenuItem, FormHelperText, FormControl, Select, Button} from '@material-ui/core';

import PublishIcon from '@material-ui/icons/Publish';
import MapIcon from '@material-ui/icons/Map';

import config from '../config.json'

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
		<FormControl style={{minWidth: "120px", paddingTop: "10px"}}>
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
      <div key={'question-'+i} style={{paddingBottom: "40px"}}>
        <Typography wrap="noWrap">
          <strong>{mapCheck.flatQuestionnaire[k].text}</strong>
        </Typography>
		{formatSelect(mapCheck.flatQuestionnaire[k].header,k,map,associationFunction)}
		<br />
		{(mapCheck.flatQuestionnaire[k].valueType == 'choice') &&
			<Button variant="contained" style={{textTransform: "none", marginTop: "10px", backgroundColor: "whiteSmoke"}}
				onClick={() => { valueMapFunction(mapCheck.flatQuestionnaire[k].header,k)}}
				disabled={!mapCheck.flatQuestionnaire[k].hasOwnProperty('header')}
			>
			Map values
			<MapIcon style={{margin: "5px"}} />			
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
		var buttonColor = buttonDisabled ?  "darkGrey" : "darkSeaGreen"
		return(
	      	<Card style={{position: "relative", backgroundColor: "lightGrey", height: "100%", "minHeight": "750px"}}>
	        	<div style={{"padding": "20px"}}>
	          		<Typography variant="h6" style={{marginBottom: "5px"}}>
	            		<strong>Map Source Headers to Target Questions</strong>
	          		</Typography>
	          		<div style={{padding: "5px"}}>
	                {this.props.mapCheck && this.props.map &&
	                <div>
	                  {formatQuestions(this.props.mapCheck, this.props.map.map, this.props.onAssociation, this.props.onValueMap)}
	                </div>

	                }  
	          		</div>
	        	</div>
					<div>
					<Button variant="contained" style={{position: "absolute", right: "0px", bottom: "0px", margin: "20px", backgroundColor: buttonColor}}
						onClick={this.redirectToUpload.bind(this)}
						disabled={buttonDisabled}
					>
					Upload Data
					<PublishIcon style={{margin: "5px"}} />
					</Button>			
					</div>   	        	            
			</Card>
		);
	}
}

export default EditCard;
