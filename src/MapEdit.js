import React from "react";
import { withRouter } from 'react-router-dom';

function MapEdit(props) {
	var map = props.map;
	var id = props.id;
	var questionnaire=props.questionnaire;
	return (
		<div>
			<h2>You're editing the follow map</h2>
			<h3>id: {id}</h3>
			<code>{JSON.stringify(map)}</code>
			<h3>this is the questionnaire:</h3>
			<code>{JSON.stringify(questionnaire)}</code>
		</div>
	);
}

export default withRouter(MapEdit);