import React from "react";
import {Card, Typography, IconButton, TextField} from "@material-ui/core";

import PublishIcon from "@material-ui/icons/Publish";

import ValidationCard from "./ValidationCard.js";
import UploadDestinationSelector from "./UploadDestinationSelector.js";

import api from "./services/api.js";

import { uploadFile, checkHeaders } from "./services/validateFile.js";

class UploadCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fileName: "",
			destination: "internal",
			externalURL: ""
		};
		this.handleDestinationChange = this.handleDestinationChange.bind(this);
		this.handleURLChange = this.handleURLChange.bind(this);
	}
	setInitialState() {
		this.setState({
			finishedUploading: false,
			data: { resourceType: undefined },
			errors: {},
			invalidHeaders: [],
			missingHeaders: [],
			urlResponse: {}
		});
	}
	handleDestinationChange(text) {
		this.setState({ destination: text });
	}
	handleURLChange(text) {
		this.setState({ externalURL: text });
	}
	uploadAction(e) {
		this.refs.fileInput.click(e);
	}

	uploadCallback(csvFile) {
		csvFile = checkHeaders(
			csvFile,
			JSON.parse(JSON.stringify(this.props.map.map))
		);
		this.setState({
			invalidHeaders: csvFile.invalidHeaders,
			missingHeaders: csvFile.missingHeaders
		});
		if (csvFile.validity) {
			var url = (this.state.destination == 'external') ? encodeURIComponent(this.state.externalURL) : null
			api.postCSV("api/maps/" + this.props.map.uid + "/upload?url=" + url, csvFile.text)
			.then(response => {
				if (response.hasOwnProperty("errors")) {
					this.setState({ errors: response.errors });
				}
				if (response.hasOwnProperty("data")) {
					this.setState({ data: response.data });
				}
				if (response.hasOwnProperty("urlResponse")) {
					this.setState({ urlResponse: response.urlResponse });
				}					
				this.setState({ finishedUploading: true });
			});
		} else {
			this.setState({
				finishedUploading: true,
				invalidHeaders: csvFile.invalidHeaders,
				missingHeaders: csvFile.missingHeaders
			});
		}
	}

	upload(e) {
		e.preventDefault();
		this.setInitialState();
		uploadFile(e, this).then(csvFile => {
			this.uploadCallback(csvFile);
		});
	}

	render() {
		return (
			<Card
				style={{
					backgroundColor: "lightGrey",
					height: "100%",
					minHeight: "750px"
				}}
			>
				<div style={{ padding: "20px" }}>
					<Typography variant="h6">
						<strong>Upload Data</strong>
					</Typography>
					<UploadDestinationSelector
						destination={this.state.destination}
						externalURL={this.state.externalURL}
						onDestinationChange={this.handleDestinationChange}
						onURLChange={this.handleURLChange}
					/>
					<div style={{ padding: "5px" }}>
						<Typography variant="body1">
							Select a CSV file to upload
						</Typography>
						<TextField
							disabled={true}
							label={this.state.filename}
							value={this.state.fileName}
						/>
						<IconButton
							edge="start"
							color="inherit"
							aria-label="menu"
							onClick={e => {
								this.uploadAction(e);
							}}
						>
							<PublishIcon />
						</IconButton>
						<form style={{ visibility: "hidden" }}>
							<input
								type="file"
								ref="fileInput"
								accept=".csv"
								onChange={ev => {
									this.upload(ev);
								}}
							/>
						</form>
						{this.state.finishedUploading && (
							<ValidationCard
								errors={this.state.errors}
								invalidHeaders={this.state.invalidHeaders}
								missingHeaders={this.state.missingHeaders}
								success={
									this.state.data.resourceType == "Bundle"
								}
								data={this.state.data}
								urlResponse={this.state.urlResponse}
							/>
						)}
					</div>
				</div>
			</Card>
		);
	}
}

export default UploadCard;