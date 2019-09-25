function validateMap(map, questionnaire) {
	
	var flatQuestionnaire = {};
	var path = [];
	flatQuestionnaire = generateFlatQuestionnaire(questionnaire['questionnaire']['item'], flatQuestionnaire, path.slice());
	
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
				tempPath.push({"linkid": obj[i]['linkId'], "text": obj[i]['text']})
				fq = generateFlatQuestionnaire(obj[i]['item'], fq, tempPath.slice())
			}
			else {				
				if(!fq.hasOwnProperty(obj[i]['linkId'])) {
					fq[obj[i]['linkId']] = {}
				}
				var tempPath = path.slice(); //make temp copy to avoid pass by reference
				tempPath.push({"linkid": obj[i]['linkId'], "text": obj[i]['text']});
				fq[obj[i]['linkId']]['text'] = obj[i]['text'];
				if (obj[i].hasOwnProperty('answerValueSet')) {fq[obj[i]['linkId']]['answerValueSet'] = obj[i]['answerValueSet']['concept']}
				fq[obj[i]['linkId']]['valueType'] = obj[i]['type'];
				fq[obj[i]['linkId']]['path'] = tempPath;

			}
		}
	}
	return fq
}

function populateWithMap(map, vc) {
	for (var key in map) {
		if (Object.keys(map[key]).length == 0) {
			vc['invalidMap'] = true;
		}
		else {
			var tempId = map[key]['path'][map[key]['path'].length - 1]['linkid'];
			if (!vc['flatQuestionnaire'].hasOwnProperty(tempId)) {
				vc['invalidMap'] = true;
			}
			else {
				vc['flatQuestionnaire'][tempId]['header'] = key;
			}			
		}

	}
	return vc
}

function checkAllQuestions(vc) {
	for (var key in vc['flatQuestionnaire']) {
		if (!vc['flatQuestionnaire'][key].hasOwnProperty('header')) {
			vc['incompleteMap'] = true;
		}
	}
	return vc
}


export default validateMap;
