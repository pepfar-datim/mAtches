import validateMap from './validateMap.js'

function loadMapQuestionnaire(mapID, config, _this) {
	getSpecificMap(mapID, config, _this)
}

function getSpecificMap(id, config, _this) {
	fetch(config.base + 'api/maps/' + id)
	.then(res => res.json())
	.then(map => {
	  _this.setState({"map": map, "mapValidity": map.complete })
	  var questionnaireUID = map.questionnaireuid;
	  _this.setState({"questionnaireUID":questionnaireUID});  
	  return questionnaireUID
	})
	.then(questionnaireUID =>{
	  getSpecificQuestionnaire(questionnaireUID, config, _this)
	})  
}

function getSpecificQuestionnaire(id, config, _this) {
	fetch(config.base +'api/questionnaires/' + id)
	.then(res => res.json())
	.then(questionnaire => {
	  _this.setState({"questionnaire": questionnaire});
	  var mapCheck = {}
	  mapCheck = validateMap(_this.state.map, questionnaire)
	  _this.setState({mapCheck: mapCheck})
	})
}

export default loadMapQuestionnaire;
