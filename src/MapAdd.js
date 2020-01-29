import React, { Component } from "react";
import {Paper, Typography, TextField, FormControl, FormHelperText, Input, InputLabel, Select, MenuItem, IconButton} from "@material-ui/core";

import AddCircleOutlinedIcon from "@material-ui/icons/AddCircleOutlined";

import config from '../config.json';
import api from "./services/api.js";

import {stylesObj} from './styling/stylesObj.js'

class MapAdd extends Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.state = {
      'invalidName': false,
      'questionnaire': '',
      'name': ''
    }
  }

handleQuestionnaireChange(event){
  this.setState({questionnaire: event.target.value})
}

handleNameChange(event) {
  var tempName = event.target.value;
  if (this.state.timeout) {clearTimeout(this.state.timeout)}
  this.setState({
    checking: true,
    name: tempName,
    timeout: setTimeout(() => {
      this.checkName(tempName, this);
    }, 1000) 
  });
}

checkName(name, _this){
  api.get('api/maps/names/' + encodeURI(name))
  .then(nameFound => {
    _this.setState({
      invalidName: nameFound,
      checking: false
    })
  })
}

handleAdd() {
	if (!this.state.invalidName) {
	    var payload = {
	    	"map": {},
	    	"name": this.state.name,
	    	"questionnaireuid": this.state.questionnaire
	    }
	    api.post('api/maps', payload)
		.then(response => {
			response = JSON.parse(response) //not sure why this is necessary and why it's a string after .json() step above
		    window.location = config.base + 'maps/' + response.uid + '?mode=edit'
		})
	}  
}

render() {
  const questionnaireHash = this.props.questionnaireHash;
  return (
    <div style={stylesObj.themePadding}>
      <Paper style={stylesObj.addBox}>
        <div style={stylesObj.themePadding}>
          <Typography variant="h6" style={{ paddingBottom: "20px" }}>
            Create a new map
          </Typography>
          <FormControl style={stylesObj.themeWidth} >
            <InputLabel shrink htmlFor="questionnaire-select">
              Questionnaire
            </InputLabel>
            <Select value={this.state.questionnaire} displayEmpty name="questionnaire" onChange={this.handleQuestionnaireChange.bind(this)}>
              {Object.keys(questionnaireHash).map((uid, index) =>
                  <MenuItem value={uid}>{questionnaireHash[uid]}</MenuItem>
              )}     
            </Select>
          </FormControl>
          <br />
          <TextField
            style={stylesObj.themeWidth}
            id="name-entry"
            label="Name"
            value={this.state.name}
            margin="normal"
            onChange={this.handleNameChange.bind(this)}
            error={this.state.invalidName}
            helperText={this.state.invalidName && 'Name already used'}
          />
          <br />
          <IconButton
            edge="start"
            aria-label="menu"
            disabled={this.state.invalidName || this.state.checking || !this.state.name || !this.state.questionnaire}
            id="addMapButton"
            onClick={this.handleAdd.bind(this)}
          >
            <AddCircleOutlinedIcon />
          </IconButton>
        </div>
      </Paper>
    </div>
  );
}
}

export default MapAdd;