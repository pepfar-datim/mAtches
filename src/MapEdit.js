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

function pushMapBack (tempMap, mapValidity) {
  tempMap['complete'] = mapValidity;
  fetch(config.base + 'api/maps',{
  method:'PUT', 
  body:JSON.stringify(tempMap),
  headers: {
    'Content-Type': 'application/json',
  },      
})
}

function removeAssociationQuestionnaire(tempCheck, mapping, header) {
  if (mapping.hasOwnProperty('path')) {
    var position = mapping['path'].length - 1;
    var qLocation = mapping['path'][position]['linkid'];
    tempCheck['flatQuestionnaire'][qLocation]['header'] = '';
  }
  return tempCheck
}

function checkValidity(flatQuestionnaire, mappings) {
  var mapValidity = true;
  for (var i in flatQuestionnaire) {
    if (!flatQuestionnaire[i].hasOwnProperty('header')) {
      mapValidity = false;
      break
    }
    if (flatQuestionnaire[i]['header'] == "") {
      mapValidity = false;
      break
    }
  }
  for (var i in mappings) {
    if (mappings[i]['valueType'] == 'choice') {
      if (!mappings[i].hasOwnProperty('choiceMap')) {
        mapValidity = false;
        break        
      }
      if (Object.keys(mappings[i]['choiceMap']).length == 0) {
        mapValidity = false;
        break
      }
    }
  }
  return mapValidity
}

function handleDelete(header) {

  var tempMap = this.state.map;
  var tempCheck = this.state.mapCheck;
  var tempUnmappedHeaders = this.state.unmappedHeaders;
  tempCheck = removeAssociationQuestionnaire(tempCheck, tempMap['map'][header], header);
  delete tempMap['map'][header];
  delete tempUnmappedHeaders[header];
  var mapValidity = false //mapValidity false if there are unmapped headers
  if (Object.keys(tempUnmappedHeaders).length == 0) {
    mapValidity = checkValidity(tempCheck['flatQuestionnaire'], tempMap['map']);
  }
  this.setState({map: tempMap, mapCheck: tempCheck, unmappedHeaders: tempUnmappedHeaders, mapValidity: mapValidity})
  pushMapBack(tempMap, mapValidity);

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
  //could add warning here if name already exists
}

function handleAdd() {
  var tempMap = this.state.map;
  if (!tempMap.map.hasOwnProperty(this.state.newHeaderName)) {
    tempMap['map'][this.state.newHeaderName] = {}
    var tempUnmappedHeaders = this.state.unmappedHeaders;
    tempUnmappedHeaders[this.state.newHeaderName] = {};
    var mapValidity = false //map validity is false when you add a header because it's not associated yet
    this.setState({map:tempMap, newHeaderName: '', unmappedHeaders: tempUnmappedHeaders, mapValidity: mapValidity});
    pushMapBack(tempMap, mapValidity); 
  }

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
    editValueMap: false,
    header: '',
    mapID: '',
    unmappedHeaders: {}
  }
  this.handleAssociationChange = this.handleAssociationChange.bind(this);
  this.handleValueMap = this.handleValueMap.bind(this);
  this.handleValueMapClose = this.handleValueMapClose.bind(this);
}

componentDidMount() {
  loadMapQuestionnaire(this.props.id, config, this);
}

handleAssociationChange(event) {
  var tempMap = this.state.map; 
  var tempCheck = this.state.mapCheck;
  var tempUnmappedHeaders = this.state.unmappedHeaders;
  tempCheck = removeAssociationQuestionnaire(tempCheck, tempMap['map'][event.target.value], event.target.value);
  tempCheck['flatQuestionnaire'][event.target.name]['header'] = event.target.value;
  tempMap['map'][event.target.value]['path'] = tempCheck['flatQuestionnaire'][event.target.name]['path'].slice();
  tempMap['map'][event.target.value]['valueType'] = tempCheck['flatQuestionnaire'][event.target.name]['valueType'];
  delete tempUnmappedHeaders[event.target.value];
  var mapValidity = false; //assume false until proven otherwise
  if (Object.keys(tempUnmappedHeaders).length == 0) {
    mapValidity = checkValidity(tempCheck['flatQuestionnaire'], tempMap['map']);
  }  
  this.setState({mapCheck: tempCheck, map: tempMap, unmappedHeaders: tempUnmappedHeaders, mapValidity: mapValidity})
  pushMapBack(tempMap, mapValidity);
}

handleValueMap(tempHeader, tempID) {
  this.setState({editValueMap: true, header: tempHeader, mapID: tempID})
}

handleValueMapClose(event, choiceMap, header) {  
  var tempMap = this.state.map;
  tempMap['map'][header]['choiceMap'] = choiceMap;
  var mapValidity = false; //assume false until proven otherwise
  if (Object.keys(this.state.unmappedHeaders).length == 0) {
    mapValidity = checkValidity(this.state.mapCheck['flatQuestionnaire'], tempMap['map']);
  }
  this.setState({editValueMap: false, map: tempMap, mapValidity: mapValidity});
  pushMapBack(tempMap, mapValidity);
}

render() {
  return (
    <div style={{"padding": "20px"}}>
    {this.state.editValueMap &&
          <ValueMapCard 
            map={this.state.map}
            header={this.state.header}
            onValueMapClose={this.handleValueMapClose}
            mapCheck={this.state.mapCheck}
            mapID={this.state.mapID}
 
          />
    }
    {!this.state.editValueMap && this.state.mapValidity != undefined &&          
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
          <EditCard 
            mapCheck={this.state.mapCheck} 
            map={this.state.map}
            onAssociation={this.handleAssociationChange}
            onValueMap={this.handleValueMap}
            unmappedHeaders={this.state.unmappedHeaders}
            mapValidity={this.state.mapValidity}
          />
        
      </Grid>
    </Grid>      
  }
    </div>


    );
  }
}

export default MapEdit;
