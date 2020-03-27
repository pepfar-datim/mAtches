import React, { Component } from "react";
import {Grid, Paper, Card, Typography, IconButton} from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';

import UploadCard from "./UploadCard.js";
import config from '../config.json';

import loadMapQuestionnaire from './services/loadMapQuestionnaire.js';

import {stylesObj} from './styling/stylesObj.js';

function formatQuestions(mapCheck) {
  return Object.keys(mapCheck.flatQuestionnaire).map(function (k, i) {
    return(
      <div key={'question-'+i}>
        <Typography wrap="noWrap">
          <strong>{mapCheck.flatQuestionnaire[k].text}</strong>
        </Typography>
        <Typography wrap="noWrap">
          {mapCheck.flatQuestionnaire[k].header || mapCheck.flatQuestionnaire[k].constant.code + ' (constant)' || ''}
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
      questionnaire: {resource: {"name":""}},
      mapCheck: {"flatQuestionnaire":{}}
    }    
  }

  componentDidMount() {
    loadMapQuestionnaire(this.props.id, this);
  }

  render() {    
    return (
        <div style={stylesObj.themePadding}>
        <Grid container className={stylesObj.flexGrow} wrap="nowrap" spacing={2}>
          <Grid item xs={3} style={stylesObj.gridWidth}>
              <Card style={stylesObj.sideCard} wrap="wrap">
                  <div style={stylesObj.themePadding}>            
                    <Typography variant="h6">
                      <strong>Map name: </strong>{this.state.map.name}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Questionnaire: </strong>{this.state.questionnaire.resource.name}
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
