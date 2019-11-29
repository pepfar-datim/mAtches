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
import PublishIcon from '@material-ui/icons/Publish';

import ChipInput from 'material-ui-chip-input'

import ValueMapUploadDialogue from "./ValueMapUploadDialogue.js";
import config from '../config.json'

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
			valueMapUploadDialogue: false
		};
		this.formatValueMap = this.formatValueMap.bind(this);
		this.formatChips = this.formatChips.bind(this);
		this.handleAddChip = this.handleAddChip.bind(this);
		this.handleDeleteChip = this.handleDeleteChip.bind(this);
		this.handleDialogueChange = this.handleDialogueChange.bind(this)
	}

	componentDidMount() {
		var tempValueSet = this.props.mapCheck['flatQuestionnaire'][this.props.mapID]['answerValueSet'];
		var tempChoiceMap = generateChoiceMap(this.props.map['map'][this.props.header], tempValueSet);
		tempValueSet = loadValueSet(tempChoiceMap, tempValueSet)
		this.setState({choiceMap: tempChoiceMap, valueSet: tempValueSet})
	}

	formatValueMap(valueSet) {
	 	return valueSet.map( (o, i) => {
			return(
				<div>
					<Typography variant="h6" style={{marginBottom: "5px"}}>
						<strong>{o['Display']}</strong>
						<br />
						{this.formatChips(o['maps'], i, o['Code'])}
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
			tempValueSet[index]['maps'].push(chip);
			this.setState({choiceMap: tempChoiceMap, valueSet: tempValueSet})
		}
	}

	handleDeleteChip(chip, index, code) {
		var tempChoiceMap = this.state.choiceMap;
		var tempValueSet = this.state.valueSet;
		delete tempChoiceMap[chip];
		var filteredValueSet = tempValueSet[index]['maps'].filter(v => v != chip);
		tempValueSet[index]['maps'] = filteredValueSet;
		this.setState({choiceMap: tempChoiceMap, valueSet: tempValueSet})

	}

	handleDialogueChange() {
		this.setState({valueMapUploadDialogue: !this.state.valueMapUploadDialogue})
	}

	render() {
		return(
	      	<Card style={{position: "relative", backgroundColor: "ghostWhite", height: "100%", "minHeight": "750px"}}>
	        	<div style={{"padding": "20px"}}>
	          		<Typography variant="h6" style={{marginBottom: "5px"}}>
	            		<strong>Map Values</strong> for {this.props.header}
	            		<br />
	          		</Typography>
	          		<Button
	          			style={{textTransform: "none", marginTop: "10px", backgroundColor: "lightSteelBlue"}}
	          			onClick={this.handleDialogueChange}
	          		>
	          		Upload Values Map
	          			<PublishIcon />
	          		</Button>
	          		{this.state.valueMapUploadDialogue &&
	          			<ValueMapUploadDialogue 
	          				open = {this.state.valueMapUploadDialogue}
	          				onClose = {this.handleDialogueChange}
	          				valueSet = {this.props.mapCheck['flatQuestionnaire'][this.props.mapID]['answerValueSet']}
	          				header = {this.props.header}
	          				uid = {this.props.map.uid}
	          			/>
	          		}
	          		<br />
	          		<div style={{margin: "20px"}}>
	          			{this.formatValueMap(this.state.valueSet)}
	          		</div>
					<Button variant="contained" style={{position: "absolute", right: "0px", bottom: "0px", margin: "20px", backgroundColor: "lightSteelBlue"}}
						onClick={(e) => this.props.onValueMapClose(e, this.state.choiceMap, this.props.header)}
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
