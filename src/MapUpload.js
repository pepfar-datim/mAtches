import React from "react";
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

const drawerWidth = 200;

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: "500px",
    width: "500px",
  },
  control: {
    padding: theme.spacing(2),
  },
}));

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


function MapUpload(props) {
  const classes = useStyles();

  var map = props.map;  
  var mapCheck = props.mapCheck;


  return (
    <div style={{"padding": "20px"}}>
    <Grid container className={classes.root} wrap="nowrap" spacing={2}>
      <Grid item xs={3} style={{maxWidth: "300px"}}>
          <Card style={{backgroundColor: "lightBlue", height: "100%"}} wrap="wrap">
              <div style={{"padding": "20px"}}>            
                <Typography variant="h6">
                  <strong>{map.name}</strong>
                </Typography>
                <Typography variant="body1">
                  ({props.questionnaireName})
                </Typography>                
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick = {() => {window.location = config.base + 'maps/' + map.uid + "?mode=edit"}}
                >
                  <Edit />
                </IconButton>
                <br />
                <br />
                {props.mapCheck &&
                <div>
                  {formatQuestions(props.mapCheck)}
                </div>
                }  
              </div>        
          </Card>
      </Grid>
      <Grid item xs >
        <UploadCard map={map}/>
      </Grid>
    </Grid>      
    </div>


  );
}

export default MapUpload;
