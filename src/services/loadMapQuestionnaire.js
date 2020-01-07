import validateMap from './validateMap.js'

import api from "./api.js";

function loadMapQuestionnaire(mapID, _this) {
	getSpecificMap(mapID, _this)
}

function getSpecificMap(id, _this) {
	api.get('api/maps/' + id)
	.then(map => {
	  _this.setState({"map": map, "mapValidity": map.complete })
	  var questionnaireUID = map.questionnaireuid;
	  _this.setState({"questionnaireUID":questionnaireUID});  
	  return questionnaireUID
	})
	.then(questionnaireUID =>{
	  getSpecificQuestionnaire(questionnaireUID, _this)
	})  
}

function getSpecificQuestionnaire(id, _this) {
	api.get('api/questionnaires/' + id)
	.then(questionnaire => {
	  _this.setState({"questionnaire": questionnaire});
	  var mapCheck = {}
	  mapCheck = validateMap(_this.state.map, questionnaire)
	  _this.setState({mapCheck: mapCheck})
	})
}

export default loadMapQuestionnaire;
