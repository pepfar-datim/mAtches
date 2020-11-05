function validateMap(map, questionnaire) {
	
	var flatQuestionnaire = {};
	var path = [];
	flatQuestionnaire = generateFlatQuestionnaire(questionnaire.resource.item, flatQuestionnaire, path.slice());
	
	var validityCheck = {flatQuestionnaire: flatQuestionnaire};
	validityCheck = populateWithMap(map['map'], validityCheck)
	validityCheck = checkAllQuestions(validityCheck)
	return validityCheck
}

function generateFlatQuestionnaire(obj, fq, path) {
	if (Array.isArray(obj)) {
		for (let i=0; i<obj.length; i++) {
			if (obj[i].hasOwnProperty('item')) {
				var tempPath = path.slice(); //make temp copy to avoid pass by reference
				tempPath.push({"linkid": obj[i]['linkId'], "text": obj[i]['text'], "required": obj[i].required})
				fq = generateFlatQuestionnaire(obj[i]['item'], fq, tempPath.slice())
			}
			else {				
				if(!fq.hasOwnProperty(obj[i]['linkId'])) {
					fq[obj[i]['linkId']] = {}
				}
				var tempPath = path.slice(); //make temp copy to avoid pass by reference
				tempPath.push({"linkid": obj[i].linkId, "text": obj[i].text, "required": obj[i].required});
				fq[obj[i].linkId].text = obj[i].text;
				fq[obj[i].linkId].required = obj[i].required;
				if (obj[i].hasOwnProperty('answerValueSet')) {
					fq[obj[i].linkId].answerValueSet = obj[i].answerValueSet.concept;
					for (var a of fq[obj[i].linkId].answerValueSet) {
						a.valueType = 'choice'
					}
				}
				if (obj[i].hasOwnProperty('answerOption')) {
					fq[obj[i].linkId].answerOption = obj[i].answerOption;
					fq[obj[i].linkId].answerValueSet = []
					fq[obj[i].linkId].answerValueSet = obj[i].answerOption.map(ans => {
						let keyName = Object.keys(ans).filter(k => k != 'initialSelected')[0];
						let tempItem = {};
						if (keyName != 'valueCoding') {
							tempItem = {code: ans[keyName], display: ans[keyName], valueType: keyName.replace('value').toLowerCase()}
						} else {
							tempItem = Object.assign({}, ans[keyName], {valueType: 'choice'})
							if (!tempItem.display) {tempItem.display = tempItem.code}
						}
						return tempItem
					});
				}
				fq[obj[i].linkId].valueType = obj[i].type;
				fq[obj[i].linkId].path = tempPath;

			}
		}
	}
	return fq
}

function populateWithMap(map, vc) {
	for (var key in map.headers) {
		if (Object.keys(map.headers[key]).length == 0) {
			vc.invalidMap = true;
		} else {
			var tempId = map.headers[key]['path'][map.headers[key]['path'].length - 1]['linkid'];
			if (!vc.flatQuestionnaire.hasOwnProperty(tempId)) {
				vc.invalidMap = true;
			} else {
				vc.flatQuestionnaire[tempId].header = key;
			}			
		}

	}
	for (var key in map.constants) {
		if (!vc.flatQuestionnaire.hasOwnProperty(key)) {
			vc.invalidMap = true;
		} else {
			vc.flatQuestionnaire[key].constant = map.constants[key];
		}
	}
	return vc
}

function checkAllQuestions(vc) {
	for (var key in vc['flatQuestionnaire']) {
		let mappedToHeader = !!(vc['flatQuestionnaire'][key].header || '').length;
		let mappedToConstant = !!(Object.keys((vc['flatQuestionnaire'][key].constant || {})).length);
		if (mappedToHeader == mappedToConstant) {
			vc.invalidMap = true;
			break
		}
	}
	return vc
}


export default validateMap;
