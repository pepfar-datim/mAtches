import React from "react";
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';

import SaveIcon from '@material-ui/icons/Save';
import AddCircleOutlinedIcon from "@material-ui/icons/AddCircleOutlined";

import ChipInput from 'material-ui-chip-input'

import config from '../config.json'

function formatValueMap(valueSet) {
 	return valueSet.map(function (o, i) {
		return(
			<div>
				<Typography variant="h6" style={{marginBottom: "5px"}}>
					<strong>{o['Display']}</strong>
					<br />
					{formatChips(o['maps'])}
				</Typography>
				<br />
			</div>
		)	
	})

}

function handleAddChip(chip) {
	console.log('adding ' + chip);
}

function handleDeleteChip(chip) {
	console.log('deleting ' + chip);
}

function formatChips(mapValues) {
		return(
			<ChipInput
				value={mapValues}
				onAdd={(chip) => {handleAddChip(chip)}}
				onDelete={(chip) => {handleDeleteChip(chip)}}
			/>
		)
}

function generateChoiceMap(headerDefinitions, tempValueSet) {
	var tempChoiceMap = {};
	if (headerDefinitions.hasOwnProperty('choiceMap')) {
		tempChoiceMap = headerDefinitions['choiceMap'];
	}
	else {
		for (let i =0; i<tempValueSet.length; i++) {
			tempChoiceMap[tempValueSet[i]['Code']] = tempValueSet[i]['Code'];
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
	for (let i =0; i<tempValueSet.length; i++) {
		tempValueSet[i]['maps'] = [];
		if (reverseChoiceMap.hasOwnProperty(tempValueSet[i]['Code'])) {
			tempValueSet[i]['maps'] = reverseChoiceMap[tempValueSet[i]['Code']]
		}
	}
	return tempValueSet
}

class ValueMapCard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			choiceMap: {},
			valueSet: [],
		};
	}

	componentDidMount() {
		var tempValueSet = this.props.mapCheck['flatQuestionnaire'][this.props.mapID]['answerValueSet'];
		var tempChoiceMap = generateChoiceMap(this.props.map['map'][this.props.header], tempValueSet);
		tempValueSet = loadValueSet(tempChoiceMap, tempValueSet)
		this.setState({choiceMap: tempChoiceMap, valueSet: tempValueSet})
	}

	render() {
		return(
	      	<Card style={{position: "relative", backgroundColor: "lightYellow", height: "100%", "minHeight": "750px"}}>
	        	<div style={{"padding": "20px"}}>
	          		<Typography variant="h6" style={{marginBottom: "5px"}}>
	            		<strong>Map Values</strong>
	            		<br />
	            		Header: {this.props.header}
	          		</Typography>
	          		<Typography variant="body1" style={{marginBottom: "5px"}}>
	          		{JSON.stringify(this.state.choiceMap)}
	          		{JSON.stringify(this.state.valueSet)}
	          		</Typography>
	          		<div style={{margin: "20px"}}>
	          			{formatValueMap(this.state.valueSet)}
	          		</div>
					<Button variant="contained" style={{position: "absolute", right: "0px", bottom: "0px", margin: "20px", backgroundColor: "lightBlue"}}
						onClick={this.props.onValueMapClose}
					>
					Save and Close
					<SaveIcon style={{margin: "5px"}} />
					</Button>	
	        	</div>
        	            
			</Card>
		);
	}
}

export default ValueMapCard;
