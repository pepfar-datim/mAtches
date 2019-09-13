import React, { Component } from "react";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton";
import Edit from '@material-ui/icons/Edit';
import Chip from '@material-ui/core/Chip';
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";

import AddCircleOutlinedIcon from "@material-ui/icons/AddCircleOutlined";

import { makeStyles } from '@material-ui/core/styles';
import { sizing } from '@material-ui/system';

import EditCard from "./EditCard.js";
import ValueMapCard from "./ValueMapCard.js";
import config from '../config.json'

import loadMapQuestionnaire from './services/loadMapQuestionnaire.js'


const drawerWidth = 200;

const classes = {
  root: {
    flexGrow: 1,
  },
  paper: {
    height: "500px",
    width: "500px",
  }
};

function pushMapBack (tempMap) {
  fetch(config.base + 'api/maps',{
  method:'PUT', 
  body:JSON.stringify(tempMap),
  headers: {
    'Content-Type': 'application/json',
  },      
})
}

function handleDelete(header) {

  var tempMap = this.state['map'];
  delete tempMap['map'][header];
  this.setState({map: tempMap})
  pushMapBack(tempMap);

}

function handleNameChange(event) {
  var tempName = event.target.value;
  if (this.state.timeout) {clearTimeout(this.state.timeout)}
  this.setState({
    checking: true,
    newHeaderName: tempName,
    timeout: setTimeout(() => {
      checkName(tempName);
    }, 1000) 
  });  
}

function checkName(tempName) {
  console.log('name should be checked');
}

function handleAdd() {
  var tempMap = this.state['map'];
  tempMap['map'][this.state.newHeaderName] = {}
  this.setState({map:tempMap, newHeaderName: ''})
  pushMapBack(tempMap);

}

class MapEdit extends Component {

formatHeaders(currentMap, _this) {
  return Object.keys(currentMap).map(function (k, i) {
    return(
      <div key={'chip_'+i}>
        <Chip
          label={k}
          onDelete={handleDelete.bind(_this, k)}
          style={{"margin":"5px"}}
        />
      </div>
    )
  })  
}

  constructor(props){
    super(props);
    this.state = {
      map: {"name":"","uid":""},
      questionnaire: {"name":""},
      mapCheck: {"flatQuestionnaire":{}},
      newHeaderName: '',
      editValueMap: false 
    }
    this.handleAssociationChange = this.handleAssociationChange.bind(this);
    this.handleValueMap = this.handleValueMap.bind(this);        
  }

  componentDidMount() {
    loadMapQuestionnaire(this.props.id, config, this);
  }

  handleAssociationChange(event) {
    var tempMap = this.state.map; 
    var tempCheck = this.state.mapCheck;
    if (tempMap['map'][event.target.value].hasOwnProperty('path')) {
      var position = tempMap['map'][event.target.value]['path'].length - 1;
      var qLocation = tempMap['map'][event.target.value]['path'][position]['linkid'];
      tempCheck['flatQuestionnaire'][qLocation]['header'] = '';
    }
    tempCheck['flatQuestionnaire'][event.target.name]['header'] = event.target.value;
    tempMap['map'][event.target.value]['path'] = tempCheck['flatQuestionnaire'][event.target.name]['path'].slice();
    tempMap['map'][event.target.value]['valueType'] = tempCheck['flatQuestionnaire'][event.target.name]['valueType'];
    
    this.setState({mapCheck: tempCheck, map: tempMap})
    pushMapBack(tempMap);
  }

  handleValueMap(event) {
    console.log('clicking value map')
    this.setState({editValueMap: true})
  }

  render() {
    return (
      <div style={{"padding": "20px"}}>
      <Grid container className={classes.root} wrap="nowrap" spacing={2}>
        <Grid item xs={3} style={{maxWidth: "300px"}}>
            <Card style={{backgroundColor: "lightBlue", height: "100%"}} wrap="wrap">
                <div style={{"padding": "20px"}}>            
                  <Typography variant="h6">
                    <strong>Map name: </strong>{this.state.map.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Questionnaire: </strong>{this.state.questionnaire.name}
                  </Typography>
                  <br /> 
                  <br />
                  <Typography variant="h6">
                    <strong>Source Headers</strong>
                  </Typography>              
                  <br />
                  <TextField
                    style={{width:'120px'}}
                    id="standard-name"
                    label="Add a Header"
                    value={this.state.newHeaderName}
                    margin="normal"
                    onChange={handleNameChange.bind(this)}
                  />
                  <br />
                  <IconButton
                    edge="start"
                    aria-label="menu"
                    onClick={handleAdd.bind(this)}
                  >
                    <AddCircleOutlinedIcon />
                  </IconButton>
                  <br />
                  <br />
                  {this.state.map['map'] &&
                  <div>
                    {this.formatHeaders(this.state.map['map'], this)}
                  </div>
                  }  
                </div>        
            </Card>
        </Grid>
        <Grid item xs >
          {!this.state.editValueMap &&
            <EditCard 
              mapCheck={this.state.mapCheck} 
              map={this.state.map}
              onAssociation={this.handleAssociationChange}
              onValueMap={this.handleValueMap}
            />
          }
          {this.state.editValueMap &&
            <ValueMapCard 
              map={this.state.map}
              indicator={'ID'}
              onAssociation={this.handleAssociationChange}
            />
          }          
        </Grid>
      </Grid>      
      </div>


    );
  }
}

export default MapEdit;
