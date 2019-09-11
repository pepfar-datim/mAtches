import React from "react";
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import PublishIcon from '@material-ui/icons/Publish';

function handleChange(event) {
	console.log(event)
}

function formatMenuItems(currentMap) {
 	return Object.keys(currentMap).map(function (k, i) {
		return(
			  <MenuItem value={k}>{k}</MenuItem>
		)	
	})

}

function formatSelect(header,key,map,associationFunction) {
    return(
		<FormControl style={{minWidth: "120px", paddingTop: "10px"}}>
		<Select
		  value={header || ''}
		  onChange={associationFunction}
		  name={key}
		>
			{formatMenuItems(map)}
		</Select>
		</FormControl> 
    )
}

function formatQuestions(mapCheck,map, associationFunction) {
  return Object.keys(mapCheck['flatQuestionnaire']).map(function (k, i) {
    return(
      <div key={'question-'+i} style={{paddingBottom: "40px"}}>
        <Typography wrap="noWrap">
          <strong>{mapCheck['flatQuestionnaire'][k]['text']}</strong>
        </Typography>
		{formatSelect(mapCheck['flatQuestionnaire'][k]['header'],k,map,associationFunction)}        
      </div>

    )
  })  
}

class EditCard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		return(
	      	<Card style={{backgroundColor: "lightGrey", height: "100%", "minHeight": "750px"}}>
	        	<div style={{"padding": "20px"}}>
	          		<Typography variant="h6" style={{marginBottom: "5px"}}>
	            		<strong>Map Source Headers to Target Questions</strong>
	          		</Typography>
	          		<div style={{padding: "5px"}}>
	                {this.props.mapCheck && this.props.map &&
	                <div>
	                  {formatQuestions(this.props.mapCheck, this.props.map['map'], this.props.onAssociation)}
	                </div>
	                }  
	          		</div>
	        	</div>            
			</Card>
		);
	}
}

export default EditCard;
