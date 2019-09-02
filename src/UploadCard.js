import React from "react";
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";


import PublishIcon from '@material-ui/icons/Publish';

import validateFile from './services/validateFile.js'

class UploadCard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			fileName: ''
		};
	}
 	
 	uploadAction(e) {
      	this.refs.fileInput.click(e);
      	//this.setState({fileName: 'oh hi!'})
 	}

 	upload(ev) {
 		ev.preventDefault();

 		var validity = validateFile(ev,this);
 		this.setState({validFile: validity})
 	}

	render() {
		return(
	      	<Card style={{backgroundColor: "lightGrey", height: "100%", "minHeight": "750px"}}>
	        	<div style={{"padding": "20px"}}>
	          		<Typography variant="h6">
	            		<strong>Upload Data</strong>
	          		</Typography>
	          		<div style={{padding: "5px"}}>
	          		<Typography variant="body1">
	            		Select a CSV file to upload
	          		</Typography>          		
	          			<TextField disabled={true} label={this.state.filename} value={this.state.fileName} />
						<IconButton
							edge="start"
							color="inherit"
							aria-label="menu"
							onClick={(e) => { this.uploadAction(e)}}
						>
							<PublishIcon />
						</IconButton>
						<form style={{visibility: "hidden"}}>
						  <input type="file" ref="fileInput"  accept=".csv" onChange={(ev) => { this.upload(ev)}} />
						</form>
	          		</div>
	          		{(this.state.validFile) &&
		          		<div>
		          			<Typography variant="body1">
		            			File Invalid
		          			</Typography>
		          			<p>{this.state.invalidHeaders}</p>
		          			<p>{this.state.missingHeaders}</p>    	
		          		</div>
		          	}
	        	</div>            
			</Card>
		);
	}
}

export default UploadCard;
