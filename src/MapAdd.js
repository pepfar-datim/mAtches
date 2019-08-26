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

handleNameChange(event){
  //make call to api (on timeout) to check name
  this.setState({name: event.target.value})
}

handleAdd(event){
  //if not invalid name push
  if (!this.state.invalidName) {
    //push, if comes back with 200, reroute to new edit of new map
  }
  
}

render() {
  const questionnaireHash = this.props.questionnaireHash;
  return (
    <div style={{ padding: "20px" }}>
      <Paper style={{ backgroundColor: "lightBlue" }}>
        <Typography style={{ padding: "20px" }} variant="h6">
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
        />
        <br />
        <IconButton
          edge="start"
          aria-label="menu"
          onClick={() => {
            console.log("adding a map");
          }}
        >
          <AddCircleOutlinedIcon />
        </IconButton>
      </Paper>
    </div>
  );
}
}

export default MapAdd;