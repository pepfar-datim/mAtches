import React, { Component } from "react";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton";
import Edit from '@material-ui/icons/Edit';
import Chip from '@material-ui/core/Chip';

import { makeStyles } from '@material-ui/core/styles';
import { sizing } from '@material-ui/system';

import EditCard from "./EditCard.js";
import config from '../config.json'

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

function formatHeaders(currentMap) {
  return Object.keys(currentMap).map(function (k, i) {
    return(
      <div key={'chip_'+i}>
        <Chip
          label={k}
          onDelete={handleDelete}
          style={{"margin":"5px"}}
        />
      </div>
    )
  })  
}

function handleDelete(event) {
  console.log(event.target.value)
}

class MapEdit extends Component {

  constructor(props){
    super(props);
    this.state = {
      map: props.map
    }
  }


  render() {
    return (
      <div style={{"padding": "20px"}}>
      <Grid container className={classes.root} wrap="nowrap" spacing={2}>
        <Grid item xs={3} style={{maxWidth: "300px"}}>
            <Card style={{backgroundColor: "lightBlue", height: "100%"}} wrap="wrap">
                <div style={{"padding": "20px"}}>            
                  <Typography variant="h6">
                    <strong>Map name: </strong>{this.props.map.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Questionnaire: </strong>{this.props.questionnaireName}
                  </Typography>
                  <br /> 
                  <br />
                  <Typography variant="h6">
                    <strong>Source Headers</strong>
                  </Typography>              
                  <br />
                  {this.props.map['map'] &&
                  <div>
                    {formatHeaders(this.props.map['map'])}
                  </div>
                  }  
                </div>        
            </Card>
        </Grid>
        <Grid item xs >
          <EditCard mapCheck={this.props.mapCheck} map={this.props.map}/>
        </Grid>
      </Grid>      
      </div>


    );
  }
}

export default MapEdit;
