import React from "react";
import {Card, Typography, IconButton, TextField, InputLabel, MenuItem, FormHelperText, FormControl, Select, Button, Chip} from '@material-ui/core';

import {Save, AddCircleOutlined, Publish} from '@material-ui/icons';

import ChipInput from 'material-ui-chip-input'

import ValueMapUploadDialogue from "./ValueMapUploadDialogue.js";

import {stylesObj} from './styling/stylesObj.js';

function generateChoiceMap(headerDefinitions, tempValueSet) {
	var tempChoiceMap = {};
	if (headerDefinitions.hasOwnProperty('choiceMap')) {
		tempChoiceMap = headerDefinitions.choiceMap;
	}
	else {
		for (let i =0; i<tempValueSet.length; i++) {
			tempChoiceMap[tempValueSet[i].Code] = tempValueSet[i].Code;
		}
	}
	return tempChoiceMap
}

function loadValueSet(tempChoiceMap, tempValueSet) {
	//maybe want to get reversed object from server side in case these become large?
	var reverseChoiceMap = {}

	for (var k in tempChoiceMap) {
		if (!reverseChoiceMap.hasOwnProperty(tempChoiceMap[k])) {
			reverseChoiceMap[tempChoiceMap[k]] = []
		}
		reverseChoiceMap[tempChoiceMap[k]].push(k)
	}
	
	tempValueSet = tempValueSet.map(function(mapItem) {
		mapItem.maps = reverseChoiceMap.hasOwnProperty(mapItem.Code) ? reverseChoiceMap[mapItem.Code] : [];
		return mapItem
	})

	return tempValueSet
}

class ValueMapCard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			choiceMap: {},
			valueSet: [],
			valueMapUploadDialogue: false
		};
		this.formatValueMap = this.formatValueMap.bind(this);
		this.formatChips = this.formatChips.bind(this);
		this.handleAddChip = this.handleAddChip.bind(this);
		this.handleDeleteChip = this.handleDeleteChip.bind(this);
		this.handleDialogueChange = this.handleDialogueChange.bind(this);
		this.handleValueMapUpdate = this.handleValueMapUpdate.bind(this);
	}

	componentDidMount() {
		var tempValueSet = this.props.mapCheck.flatQuestionnaire[this.props.mapID].answerValueSet;
		var tempChoiceMap = generateChoiceMap(this.props.map.map[this.props.header], tempValueSet);
		tempValueSet = loadValueSet(tempChoiceMap, tempValueSet)
		this.setState({choiceMap: tempChoiceMap, valueSet: tempValueSet})
	}

	formatValueMap(valueSet) {
	 	return valueSet.map( (o, i) => {
			return(
				<div>
					<Typography variant="h6" style={stylesObj.marginQuarter}>
						<strong>{o.Display}</strong>
						<br />
						{this.formatChips(o.maps, i, o.Code)}
					</Typography>
					<br />
				</div>
			)	
		})

	}	

	formatChips(mapValues, index, code) {
		return(
			<div>
				<ChipInput
					value={mapValues}
					onAdd={(chip) => {this.handleAddChip(chip, index, code)}}
					onDelete={(chip) => {this.handleDeleteChip(chip, index, code)}}
				/>
			</div>
		)
	}

	handleAddChip(chip, index, code) {
		chip = chip.trim();
		if (!this.state.choiceMap.hasOwnProperty(chip)) {
			var tempChoiceMap = this.state.choiceMap;
			var tempValueSet = this.state.valueSet;
			tempChoiceMap[chip] = code;
			tempValueSet[index].maps.push(chip);
			this.setState({choiceMap: tempChoiceMap, valueSet: tempValueSet})
		}
	}

	handleDeleteChip(chip, index, code) {
		var tempChoiceMap = this.state.choiceMap;
		var tempValueSet = this.state.valueSet;
		delete tempChoiceMap[chip];
		var filteredValueSet = tempValueSet[index].maps.filter(v => v != chip);
		tempValueSet[index].maps = filteredValueSet;
		this.setState({choiceMap: tempChoiceMap, valueSet: tempValueSet})

	}

	handleDialogueChange() {
		this.setState({valueMapUploadDialogue: !this.state.valueMapUploadDialogue})
	}

	handleValueMapUpdate(tempValueSet, tempChoiceMap) {
		this.setState({valueSet: tempValueSet, choiceMap: tempChoiceMap});
		this.handleDialogueChange();
	}

	render() {
		return(
	      	<Card style={stylesObj.valueMapCard}>
	        	<div style={stylesObj.themePadding}>
	          		<Typography variant="h6" style={stylesObj.marginQuarter}>
	            		<strong>Map Values</strong> for {this.props.header}
	            		<br />
	          		</Typography>
	          		<Button
	          			style={stylesObj.valueMapButton}
	          			onClick={this.handleDialogueChange}
	          		>
	          		Upload Values Map
	          			<Publish />
	          		</Button>
	          		{this.state.valueMapUploadDialogue &&
	          			<ValueMapUploadDialogue 
	          				open = {this.state.valueMapUploadDialogue}
	          				onClose = {this.handleDialogueChange}
	          				valueSet = {this.props.mapCheck.flatQuestionnaire[this.props.mapID].answerValueSet}
	          				header = {this.props.header}
	          				uid = {this.props.map.uid}
	          				handleValueMapUpdate = {this.handleValueMapUpdate}
	          			/>
	          		}
	          		<br />
	          		<div style={stylesObj.marginQuarter}>
	          			{this.formatValueMap(this.state.valueSet)}
	          		</div>
					<Button variant="contained" style={stylesObj.valueMapContinueButton}
						onClick={(e) => this.props.onValueMapClose(e, this.state.choiceMap, this.props.header)}
					>
					Save and Close
					<Save style={stylesObj.marginQuarter} />
					</Button>	
	        	</div>
        	            
			</Card>
		);
	}
}

export default ValueMapCard;
