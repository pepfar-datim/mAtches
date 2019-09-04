import React from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

function ValidationCard(props) {

	var cardColor = props.success ? 'darkSeaGreen' : 'lightSalmon';
	var successText = props.success ? 'Success!' : 'Invalid File';


return (
		<Card height="100%" style={{backgroundColor: cardColor, width: "100%"}}>
			<div style={{padding: "20px"}}>
				<Typography variant="h6">
					{successText}
				</Typography>
				{props.data.length>0 &&
					<Typography variant="body1">
						Questionnaire Responses: {JSON.stringify(props.data)}
					</Typography>
				}
				{props.invalidHeaders.length>0 &&
					<Typography variant="body1">
						Invalid headers: {props.invalidHeaders}
					</Typography>
				}
				{props.missingHeaders.length>0 &&
					<Typography variant="body1">
						Missing headers: {props.missingHeaders}
					</Typography>
				}							
				{Object.keys(props.errors).length>0 &&
					<Typography variant="body1">
						Errors: {JSON.stringify(props.errors)}
					</Typography>
				}		
			</div>
		</Card>
)
}

export default ValidationCard;
