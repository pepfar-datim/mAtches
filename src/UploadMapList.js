import React, { Component } from "react";
import Typography from '@material-ui/core/Typography';

import config from "../config.json";
import SearchTextComponent from "./SearchTextComponent.js";

import { forwardRef } from "react";

import {DebounceInput} from 'react-debounce-input';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MobileStepper from '@material-ui/core/MobileStepper';

import Search from "@material-ui/icons/Search";
import Sync from "@material-ui/icons/Sync";
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';


function formatMapList(maps, searchText, currentMapID, onMapProcess, currentStep, numberOfMaps) {
	return maps
		.filter(m => {
			if (m.uid == currentMapID) {return false}
			if (!searchText.trim().length) {return true}
			return m.name.toLowerCase().includes(searchText.trim().toLowerCase())
		})
		.slice(currentStep * numberOfMaps,(currentStep + 1) * numberOfMaps)
		.map(function(k, i) {
			return (
				<div>
					<Grid container spacing={1} alignItems="center">
          				<Grid item>
        				    <IconButton
					            edge="start"
					            aria-label="menu"
								onClick={() => {onMapProcess(k.map)}}					            
      						>
      							<Sync />
      						</IconButton>
          				</Grid>
          				<Grid item xs zeroMinWidth>
            				<Typography align="left" noWrap>{k.name}</Typography>
          				</Grid>
        			</Grid>					
				</div>
			)
	});
}

class UploadMapList extends Component {
	// Initialize the state
	constructor(props) {
		super(props);
		this.state = {
			maps: [],
			searchText: '',
			currentStep: 0,
			numberOfMaps: 3,
			maxSteps: 0
		};
		this.handleNext = this.handleNext.bind(this);
		this.handleBack = this.handleBack.bind(this);
		this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
	}

	// Fetch the list on first mount
	componentDidMount() {
		this.getMaps();
	}

	getMaps() {
		fetch(config.base + "api/maps")
			.then(res => res.json())
			.then(maps => {
				this.setState({ maps: maps, maxSteps: Math.ceil(maps.length / this.state.numberOfMaps)});
			});
	}

	handleNext() {
    	this.setState({currentStep: this.state.currentStep + 1});
  	}

	handleBack() {
    	this.setState({currentStep: this.state.currentStep - 1});
  	}

  	handleSearchTextChange(newText) {
  		var tempMax = Math.ceil(this.state.maps.length / this.state.numberOfMaps);
  		var tempStep = this.state.currentStep
  		if (newText.trim().length != 0) {
  			var tempLength = this.state.maps.filter(m => {return m.name.toLowerCase().includes(newText.trim().toLowerCase())}).length;  			
  			tempMax = Math.ceil(tempLength / this.state.numberOfMaps);
  			tempStep = Math.min(this.state.currentStep, (tempMax -1));
  		}
  		this.setState({searchText: newText, currentStep: tempStep, maxSteps: tempMax});
  	}
		
/*

//preferably, could get debounce to work with this, but it's not registering change...
		    <DebounceInput
		        	element={SearchTextComponent}
		        	debounceTimeout={300}
		        	onChange={event => console.log(event)} 
		    />
			        
*/
	render() {
		return (
			<div style={{ padding: "10px" }}>		    

		    <TextField
				id="narrowdown-search"
				label="Narrow down maps"
				onChange={e => this.handleSearchTextChange(e.target.value)}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<Search />
						</InputAdornment>
					)
				}}
			/>
			<br />
			<br />
			{formatMapList(this.state.maps, this.state.searchText, this.props.id, this.props.onMapProcess, this.state.currentStep, this.state.numberOfMaps)}
				<MobileStepper
			        steps={this.state.maxSteps}
			        position="static"
			        variant="text"
			        activeStep={this.state.currentStep}
					backButton={
						<Button size="small" onClick={this.handleBack} disabled={this.state.currentStep === 0}>
							<KeyboardArrowLeft />
						Back
						</Button>
					}
					nextButton={
						<Button size="small" onClick={this.handleNext} disabled={this.state.currentStep === this.state.maxSteps - 1}>
							<KeyboardArrowRight />
						Next
						</Button>
					}					
				>
				</MobileStepper>

				
			</div>
		);
	}
}

export default UploadMapList;