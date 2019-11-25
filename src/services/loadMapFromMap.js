function checkFQ(flatQuestionnaire, path, linkid) {
	var validity = false;
	if (flatQuestionnaire.hasOwnProperty(linkid)) {
		//objects should be the same format, but this is an assumption of ease and not really valid, so should rewrite
		if (JSON.stringify(flatQuestionnaire[linkid]['path']) == JSON.stringify(path)) {
			validity = true;
		}
	}

	return validity

}

function loadMapFromMap(flatQuestionnaire, baseMap, newMap, unmappedHeaders) {
	var returnObj = {};
	for (var header in baseMap) {
		//if not in newMap, add 
		if (!newMap.map.hasOwnProperty(header)) {
			newMap.map[header] = {}
			unmappedHeaders[header] = {}
		}

		if (baseMap[header].hasOwnProperty("path")) {
			var linkid = baseMap[header]["path"].slice(-1)[0]["linkid"];
			var match = checkFQ(flatQuestionnaire, baseMap[header]["path"], linkid)

			if (match) {

				//if there is a match to Questionnaire, copy properties from Base Map and make association
				var propertiesToCopy = ['path', 'valueType', 'choiceMap']
				for (let i =0; i<propertiesToCopy.length; i++) {
					if (baseMap[header].hasOwnProperty(propertiesToCopy[i])) {
						newMap.map[header][propertiesToCopy[i]] = JSON.parse(JSON.stringify(baseMap[header][propertiesToCopy[i]]));
 					}
				}

				//remove existing association in flatQuestionnaire from map (if different header)
				if (flatQuestionnaire[linkid].hasOwnProperty('header')) {
					if (newMap.map.hasOwnProperty(flatQuestionnaire[linkid]['header']) && flatQuestionnaire[linkid]['header'] != header) {
						delete newMap.map[flatQuestionnaire[linkid]['header']];
					}
				}

				//update association in flatQuestionnaire
				flatQuestionnaire[linkid]['header'] = header;

				//and delete from unmapped headers
				if (unmappedHeaders.hasOwnProperty(header)) {
					delete unmappedHeaders[header];	
				}

			}
		}
	}

	returnObj.flatQuestionnaire = flatQuestionnaire;
	returnObj.newMap = newMap;
	returnObj.unmappedHeaders = unmappedHeaders;
	return returnObj;
}

export default loadMapFromMap;