import React from "react";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Drawer from '@material-ui/core/Drawer';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import { sizing } from '@material-ui/system';

import HeaderBar from "./HeaderBar.js";

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

function MapUpload(props) {
  const classes = useStyles();

  var map = props.map;
  var id = props.id;
  var questionnaire=props.questionnaire;

  return (
    <div style={{"padding": "20px"}}>
    <Grid container className={classes.root} wrap="nowrap" spacing={2}>
      <Grid item xs={3} style={{maxWidth: "300px"}}>
          <Card style={{backgroundColor: "lightBlue", height: "100%"}} wrap="wrap">
              <div style={{"padding": "20px"}}>            
                <Typography variant="h6">
                  <strong>{id}</strong>
                </Typography>
                <Typography wrap="noWrap">
                  Where was the patient born? And why were they born there and not some other place?
                </Typography>
                <Typography>
                  <br/>
                  Question 1<br/>
                  Column A<br /><br/>
                  Question 2<br/>
                  Column B<br /><br/>                
                </Typography>      
              </div>        
          </Card>
      </Grid>
      <Grid item xs >
          <Card style={{backgroundColor: "lightGrey", height: "100%", "minHeight": "750px"}}>
 
              <Typography variant="h6">
                Upload Data
              </Typography>
            
          </Card>
      </Grid>
    </Grid>      
    </div>


  );
}

export default MapUpload;