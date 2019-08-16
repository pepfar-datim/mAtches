import React from "react";

function MapUpload(props) {
	var map = props.map;
	var id = props.id;
	var questionnaire=props.questionnaire;
	return (
		<div>
			<h2>You're uploading against the follow map</h2>
			<h3>id: {id}</h3>
			<code>{JSON.stringify(map)}</code>
			<h3>this is the questionnaire:</h3>
			<code>{JSON.stringify(questionnaire)}</code>

		</div>
	);
}

export default MapUpload;