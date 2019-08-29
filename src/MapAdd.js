import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";

import AddCircleOutlinedIcon from "@material-ui/icons/AddCircleOutlined";

import config from '../config.json'

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
  fetch(config.base + 'api/maps/names/' + encodeURI(name))
  .then(res => res.json())
  .then(nameFound => {
    _this.setState({
      invalidName: nameFound,
      checking: false
    })
  })
}

handleAdd(){
  if (!this.state.invalidName) {
    var payload = {
      "map": {},
      "name": this.state.name,
      "questionnaireuid": this.state.questionnaire
    }
    fetch(config.base + 'api/maps',{
      method:'POST', 
      body:JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },      
    })
  .then(res => res.json())
  .then(response => {
    response = JSON.parse(response) //not sure why this is necessary and why it's a string after .json() step above
    window.location = config.base + 'maps/' + response.uid + '?mode=edit'
  })
  }
  
}

render() {
  const questionnaireHash = this.props.questionnaireHash;
  return (
    <div style={{ padding: "20px" }}>
      <Paper style={{ backgroundColor: "lightBlue" }}>
        <div style={{ padding: "20px" }}>
          <Typography variant="h6" style={{ paddingBottom: "20px" }}>
            Create a new map
          </Typography>
          <FormControl style={{width:'200px'}} >
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
            style={{width:'200px'}}
            id="standard-name"
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