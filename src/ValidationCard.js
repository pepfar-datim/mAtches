import React from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

function formatErrors(errors) {
	return Object.keys(errors).map(key =>{
		return (
			<div>
				<Typography variant="h6" style={{paddingLeft: "10px", paddingTop: "20px"}}>
					{key}
				</Typography>
				{errors[key].hasOwnProperty('invalidValueMapping') &&
					<Typography variant="body1" style={{paddingLeft: "20px", paddingTop: "5px"}}>
						Values are not Mapped for following values: {Object.keys(errors[key].invalidValueMapping).join(', ')}
					</Typography>
				}
				{errors[key].hasOwnProperty('invalidValueType') &&
					<Typography variant="body1" style={{paddingLeft: "20px", paddingTop: "5px"}}>
						Values are Invalid on the following rows: {errors[key].invalidValueType.join(', ')}
					</Typography>
				}
			</div>
		)		
	})

}

function ValidationCard(props) {

	var cardColor = props.success ? 'darkSeaGreen' : 'lightSalmon';
	var successText = props.success ? 'Success!' : (Object.keys(props.errors).length > 0 ? 'Invalid File: Value Errors' : 'Invalid File: Header Errors');


return (
		<div>
			{props.invalidHeaders.length >0 &&
				<Card height="100%" style={{backgroundColor: "lightYellow", width: "100%", marginBottom: "10px"}}>
					<div style={{padding: "20px"}}>
						<Typography variant="h6">
							<strong>Warning: Extra Headers in CSV File</strong>
						</Typography>
						{props.invalidHeaders.length>0 &&
							<Typography variant="body1">
								Headers in csv file, not in map: {props.invalidHeaders.join(', ')}
							</Typography>
						}							

					</div>
				</Card>
			}
			<Card height="100%" style={{backgroundColor: cardColor, width: "100%"}}>
				<div style={{padding: "20px"}}>
					<Typography variant="h6">
						<strong>{successText}</strong>
					</Typography>
					{props.data.resourceType == 'Bundle' && Object.keys(props.urlResponse).length == 0 &&
						<Typography variant="body1">
							Questionnaire Responses Bundle: {JSON.stringify(props.data)}
						</Typography>
					}
					{props.data.resourceType == 'Bundle' && Object.keys(props.urlResponse).length > 0 &&
						<Typography variant="body1">
							Response from URL: {JSON.stringify(props.urlResponse)}
						</Typography>
					}		
					{props.missingHeaders.length > 0 &&
						<Typography variant="body1">
							Headers in map, missing from csv file: {props.missingHeaders.join(', ')}
						</Typography>
					}							
					{Object.keys(props.errors).length > 0 &&
						<div>
							{formatErrors(props.errors)}
						</div>
					}		
				</div>
			</Card>
		</div>
)
}

export default ValidationCard;
