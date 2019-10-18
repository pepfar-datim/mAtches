import React from "react";
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";

import PublishIcon from '@material-ui/icons/Publish';

import ValidationCard from './ValidationCard.js'

import config from '../config.json'

import {uploadFile, checkHeaders} from './services/validateFile.js'

class UploadCard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			fileName: '',
		};
	}
 	setInitialState() {
 		this.setState({
 			finishedUploading:false,
 			data: [],
 			errors: {},
 			invalidHeaders: [],
 			missingHeaders: [],
 		})
 	}
 	uploadAction(e) {
      	this.refs.fileInput.click(e);
 	}

 	uploadCallback(csvFile) {
 		csvFile = checkHeaders(csvFile, JSON.parse(JSON.stringify(this.props.map.map)));
		this.setState({invalidHeaders: csvFile.invalidHeaders, missingHeaders: csvFile.missingHeaders})
		if (csvFile.validity) {
		fetch(config.base + 'api/maps/' + this.props.map.uid + '/upload', {
    		method:'POST', body:csvFile.text, headers: {'Content-Type': 'text/plain; charset=UTF-8'}
		})
		.then(results => results.json())
		.then(response => {
			if(response.hasOwnProperty('errors')){
				this.setState({errors: response.errors})	
			}
			if(response.hasOwnProperty('data')){
				this.setState({data: response.data})	
			}
			this.setState({finishedUploading: true})
		})

		}
		else { 
			this.setState({finishedUploading: true, invalidHeaders: csvFile.invalidHeaders, missingHeaders: csvFile.missingHeaders})	
		} 		
 	}

 	upload(e) {
 		e.preventDefault();
 		this.setInitialState();
 		uploadFile(e,this).then(csvFile => {
 			this.uploadCallback(csvFile)
 		}); 		
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
						{this.state.finishedUploading &&
							<ValidationCard 
								errors={this.state.errors}
								invalidHeaders={this.state.invalidHeaders}
								missingHeaders={this.state.missingHeaders}
								success={this.state.data.length>0}
								data={this.state.data}
							/>
						}
	          		</div>
	        	</div>            
			</Card>
		);
	}
}

export default UploadCard;
