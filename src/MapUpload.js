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

import UploadCard from "./UploadCard.js";

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
                <br />
                {props.mapCheck &&
                <div>
                  <Typography wrap="noWrap">
                    <strong>{mapCheck['flatQuestionnaire']['/Patient/id']['text']}</strong>
                  </Typography>
                  <Typography wrap="noWrap">
                    {mapCheck['flatQuestionnaire']['/Patient/id']['header']}
                  </Typography>                  
                </div>
                }
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
        <UploadCard map={map}/>
      </Grid>
    </Grid>      
    </div>


  );
}

export default MapUpload;
