import React from "react";
import {Typography} from '@material-ui/core';

function generateEmptyQuestions(flatQuestionnaire) {
	let tempEmptyQuestions = [];
	Object.keys(flatQuestionnaire).map(k => {
		if (!(flatQuestionnaire[k].header || '').length) {
			tempEmptyQuestions.push(flatQuestionnaire[k].text);
		}
	}, tempEmptyQuestions)
	return tempEmptyQuestions
}

function SendButtonTooltip(props) {
	let unmappedHeaders = props.unmappedHeaders;
	let tempEmptyQuestions = generateEmptyQuestions(props.flatQuestionnaire);

	return(
		<div>
			<Typography>Cannot Upload</Typography>
			<br />
				{(Object.keys(unmappedHeaders).length != 0) &&
					<div>
						<strong>Unmapped Headers</strong>
						<br />
						<span>{Object.keys(unmappedHeaders).join(', ')}</span>
						<br /><br/>
					</div>
				}
				{(tempEmptyQuestions.length !=0) &&
					<div>
						<strong>Unmapped Questions</strong>
						<br />
						<span>{tempEmptyQuestions.join(', ')}</span>
						<br /><br/>
					</div>
				}
		</div>
	)

}

export default SendButtonTooltip;
