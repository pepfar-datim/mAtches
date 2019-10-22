import React, { Component } from "react";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton";
import Edit from '@material-ui/icons/Edit';

import { makeStyles } from '@material-ui/core/styles';
import { sizing } from '@material-ui/system';

import UploadCard from "./UploadCard.js";
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

function formatQuestions(mapCheck) {
  return Object.keys(mapCheck['flatQuestionnaire']).map(function (k, i) {
    return(
      <div key={'question-'+i}>
        <Typography wrap="noWrap">
          <strong>{mapCheck['flatQuestionnaire'][k]['text']}</strong>
        </Typography>
        <Typography wrap="noWrap">
          {mapCheck['flatQuestionnaire'][k]['header'] || ''}
        </Typography>
        <br />
      </div>  
    )
  })  
}


class MapUpload extends Component {

  constructor(props){
    super(props);
    this.state = {
      map: {"name":"","uid":""},
      questionnaire: {"name":""},
      mapCheck: {"flatQuestionnaire":{}}
    }    
  }

  componentDidMount() {
    loadMapQuestionnaire(this.props.id, config, this);
  }

  render() {    
    return (
        <div style={{"padding": "20px"}}>
        <Grid container className={classes.root} wrap="nowrap" spacing={2}>
          <Grid item xs={3} style={{maxWidth: "300px"}}>
              <Card style={{backgroundColor: "lightSteelBlue", height: "100%"}} wrap="wrap">
                  <div style={{"padding": "20px"}}>            
                    <Typography variant="h6">
                      <strong>Map name: </strong>{this.state.map.name}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Questionnaire: </strong>{this.state.questionnaire.name}
                    </Typography>                
                    <IconButton
                      edge="start"
                      color="inherit"
                      aria-label="menu"
                      onClick = {() => {window.location = config.base + 'maps/' + this.state.map.uid + "?mode=edit"}}
                    >
                      <Edit />
                    </IconButton>
                    <br />
                    <br />
                    <br />
                    {this.state.mapCheck &&
                    <div>
                      {formatQuestions(this.state.mapCheck)}
                    </div>
                    }  
                  </div>        
              </Card>
          </Grid>
          <Grid item xs >
            <UploadCard map={this.state.map}/>
          </Grid>
        </Grid>      
        </div>


    );
  }
}

export default MapUpload;
