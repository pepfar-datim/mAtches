import React from "react";
import {Card, Typography, IconButton, TextField, InputLabel, MenuItem, FormHelperText, FormControl, Select, Button, Tooltip} from '@material-ui/core';

import SendButtonTooltip from "./SendButtonTooltip.js";

import SendIcon from '@material-ui/icons/Send';
import MapIcon from '@material-ui/icons/Map';
import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';

import api from "./services/api.js";

import config from '../config.json'

import {stylesObj} from './styling/stylesObj.js';

function handleChange(event) {
	console.log(event)
}

function formatMenuItems(currentMap) {
 	return Object.keys(currentMap.headers).map(function (k, i) {
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
		  data_cy={key + '_selectItem'}
		>
			{formatMenuItems(map)}
		</Select>
		</FormControl> 
    )
}

function formatQuestions(mapCheck,map, associationFunction, valueMapFunction, constantChange) {
  return Object.keys(mapCheck.flatQuestionnaire).map(function (k, i) {
  	let mappedToConstant = !!((mapCheck.flatQuestionnaire[k].constant || '').length);
  	let mappedToHeader = !!((mapCheck.flatQuestionnaire[k].header || '').length);
  	let mappedItem = mappedToConstant || mappedToHeader
    return(
      <div key={'question-'+i} style={stylesObj.editCardSelectorPadding}>
        <Typography wrap="noWrap" style={mappedItem ? stylesObj.completeQuestion : stylesObj.incompleteQuestion}>

          <strong>{mapCheck.flatQuestionnaire[k].text}</strong>
          {!mappedToConstant && 
	          <Tooltip title="Replace this item with a constant value">
		          <IconButton
		          	onClick={() => {constantChange(k, 'add', 'hedgehog')}}
		          >		          	
		          	<LinkIcon />
		          </IconButton>
		      </Tooltip>
		   }
        </Typography>
        {!mappedToConstant && 
        	<div>
				{formatSelect(mapCheck.flatQuestionnaire[k].header,k,map,associationFunction)}
				<br />
				{(mapCheck.flatQuestionnaire[k].valueType == 'choice') &&
					<Button 
						variant="contained" 
						style={getValueMapButtonStyle(mapCheck.flatQuestionnaire[k], (map.headers[mapCheck.flatQuestionnaire[k].header] || {}))}
						onClick={() => { valueMapFunction(mapCheck.flatQuestionnaire[k].header,k)}}
						disabled={!(mapCheck.flatQuestionnaire[k].header || '').length}
					>
					Map values
					<MapIcon style={stylesObj.editCardSelectorButtonIcon} />			
					</Button>
				}
			</div>
		}
		{mappedToConstant && 
			<Typography wrap="noWrap">
				<span>{'Constant value: ' + mapCheck.flatQuestionnaire[k].constant}</span>
				<Tooltip title="Remove link to constant value and map to header">
					<IconButton
						onClick = {() => {constantChange(k, 'delete')}}
					>
						<LinkOffIcon />
					</IconButton>
				</Tooltip>
			</Typography>	
		}
      </div>

    )
  })  
}

function getValueMapButtonStyle (questionnaireItem, mapItem) {
	if (!(questionnaireItem.header || '').length) {
		return stylesObj.editCardSelectorButtonDisabled
	}
	var tempChoiceMap = (mapItem.choiceMap || {})
	if (Object.entries(tempChoiceMap).length) {
		return stylesObj.editCardSelectorButtonComplete
	}
	return stylesObj.editCardSelectorButtonIncomplete
}

class EditCard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			buttonDelay: false,
		};
	}

sendMap () {
	// api.sendMap(JSON.stringify(this.props.map));
	this.setState({buttonDelay: true, submittedMap: JSON.parse(JSON.stringify(this.props.map))})
	setTimeout(() => { 
		this.setState({buttonDelay: false})
	}, 10000)
}
	
	render() {
		var mapUnchanged = JSON.stringify(this.state.submittedMap) == JSON.stringify(this.props.map);
		var buttonDisabled = Object.keys(this.props.unmappedHeaders).length > 0 || !this.props.mapValidity || this.state.buttonDelay || mapUnchanged;
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
	                  {formatQuestions(this.props.mapCheck, this.props.map.map, this.props.onAssociation, this.props.onValueMap, this.props.constantChange)}
	                </div>

	                }  
	          		</div>
	        	</div>
					
					<Tooltip title={!buttonDisabled ? '' : <SendButtonTooltip mapUnchanged={mapUnchanged} tempDelay={this.state.buttonDelay} unmappedHeaders={this.props.unmappedHeaders} flatQuestionnaire={this.props.mapCheck.flatQuestionnaire}/>}>
						<div style={stylesObj.editCardUploadButtonDiv}>					
							<Button variant="contained" style={buttonUploadStyling}
								onClick={this.sendMap.bind(this)}
								disabled={buttonDisabled}
							>
								Submit to {config.externalMappingLocation}
								<SendIcon style={stylesObj.marginQuarter} />
							</Button>
						</div>   	        	            
					</Tooltip>			
					
			</Card>
		);
	}
}

export default EditCard;
