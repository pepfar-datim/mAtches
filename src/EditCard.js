import React from "react";
import {Card, Typography, IconButton, TextField, InputLabel, MenuItem, FormHelperText, FormControl, Select, Button, Tooltip} from '@material-ui/core';

import SendButtonTooltip from "./SendButtonTooltip.js";
import ConstantDialog from "./ConstantDialog.js";
import RequiredNonRequiredSelector from "./RequiredNonRequiredSelector.js";

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

function formatQuestions(mapCheck,map, associationFunction, valueMapFunction, constantChange, setConstantDialogOpen, itemVisibility) {
  return Object.keys(mapCheck.flatQuestionnaire).map(function (k, i) {
  	//let mappedToConstant = !!((Object.keys(mapCheck.flatQuestionnaire[k].constant) || '').length);
  	let mappedToConstant = !!(Object.keys((mapCheck.flatQuestionnaire[k].constant || {})).length);
  	let mappedToHeader = !!((mapCheck.flatQuestionnaire[k].header || '').length);
  	let mappedItem = mappedToConstant || mappedToHeader
    return(
      <>
      {(itemVisibility=='all' || mapCheck.flatQuestionnaire[k].required) &&
	      <div key={'question-'+i} style={stylesObj.editCardSelectorPadding}>
	        <Typography wrap="noWrap" style={mappedItem ? stylesObj.completeQuestion : stylesObj.incompleteQuestion}>

	          <strong>{mapCheck.flatQuestionnaire[k].required && "* "}{mapCheck.flatQuestionnaire[k].text}</strong>
	          {!mappedToConstant && 
		          <Tooltip title="Replace this item with a constant value">
			          <IconButton
			          	onClick={() => {
			          		let tempValueMap = [];
			          		if (mapCheck.flatQuestionnaire[k].valueType == 'choice') {
			          			tempValueMap = mapCheck.flatQuestionnaire[k]['answerValueSet'];
			          		}
			          		setConstantDialogOpen(mapCheck.flatQuestionnaire[k].text, k, tempValueMap, mapCheck.flatQuestionnaire[k].valueType, mapCheck.flatQuestionnaire[k].path)}
			          	}
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
					<span>{'Constant value: ' + mapCheck.flatQuestionnaire[k].constant.display}</span>
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
	    }
	    </>
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
			constantDialogOpen: false,
			constantHeader: '',
			qID: '',
			valueArray: [],
			valueType: '',
			path: [],
			itemVisibility: 'all'
		};
		this.setConstantDialogOpen = this.setConstantDialogOpen.bind(this);
		this.handleVisibilityChange = this.handleVisibilityChange.bind(this)
	}

	handleVisibilityChange(text) {
		this.setState({ itemVisibility: text });
	}	

	setConstantDialogOpen(ch, qID, vm, vt, path) {
		let tempConstantHeader = (typeof(ch) == 'string') ? ch : '';
		let tempQID = (typeof(qID) == 'string') ? qID : '';
		let tempValueMap = (Array.isArray(vm)) ? vm : [];
		let tempValueType = (typeof(vt) == 'string') ? vt : '';
		let tempPath = (Array.isArray(path)) ? path : [];
		this.setState({constantDialogOpen:!this.state.constantDialogOpen, constantHeader: tempConstantHeader, qID: tempQID, valueMap: tempValueMap, valueType: tempValueType, path: tempPath});
	}

	sendMap () {
		//disable for testing
		api.sendMap(this.props.map)
		.then(resp => {
			console.log(resp)
		});
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
	          		<Typography variant="body1" style={stylesObj.marginQuarterBottom}>
	            		<strong>*</strong> denotes required item
	          		</Typography>

					<RequiredNonRequiredSelector
						itemVisibility={this.state.itemVisibility}
						handleVisibilityChange={this.handleVisibilityChange}
					/>	          		

	          		<div style={stylesObj.themePaddingQuarter}>
	                {this.props.mapCheck && this.props.map &&
	                <div>
	                  {formatQuestions(this.props.mapCheck, this.props.map.map, this.props.onAssociation, this.props.onValueMap, this.props.constantChange, this.setConstantDialogOpen, this.state.itemVisibility)}
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
				{this.state.constantDialogOpen && 
					<ConstantDialog open={this.state.constantDialogOpen} closeConstantMapDialog={this.setConstantDialogOpen} constantHeader={this.state.constantHeader} qID={this.state.qID} setConstant={this.props.constantChange} valueArray={this.state.valueMap} valueType={this.state.valueType} path={this.state.path}/>
				}
			</Card>
		);
	}
}

export default EditCard;
