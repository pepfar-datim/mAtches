import validateMap from "./validateMap.js";

import api from "./api.js";

function loadMapQuestionnaire(mapID, _this) {
  getSpecificMap(mapID, _this);
}

function getSpecificMap(id, _this) {
  api
    .get("api/maps/" + id)
    .then((map) => {
      _this.setState({ map: map, mapValidity: map.complete });
      extractUnmappedHeaders(map.map, _this);
      var questionnaireUID = map.questionnaireuid;
      _this.setState({ questionnaireUID: questionnaireUID });
      return questionnaireUID;
    })
    .then((questionnaireUID) => {
      getSpecificQuestionnaire(questionnaireUID, _this);
    });
}

function getSpecificQuestionnaire(id, _this) {
  api
    .get("api/questionnaires/" + encodeURIComponent(id))
    .then((questionnaire) => {
      if (questionnaire.hasOwnProperty("message")) {
        _this.setState({ failedToLoad: questionnaire.message, loading: false });
      }
      _this.setState({ questionnaire: questionnaire });
      var mapCheck = {};
      mapCheck = validateMap(_this.state.map, questionnaire);
      _this.setState({ mapCheck: mapCheck, loading: false });
    });
}

function extractUnmappedHeaders(map, _this) {
  var tempUnmappedHeaders = {};
  for (var k in map.headers) {
    if (
      Object.keys(map.headers[k]).length === 0 &&
      map.headers[k].constructor === Object
    ) {
      tempUnmappedHeaders[k] = {};
    }
  }
  _this.setState({ unmappedHeaders: tempUnmappedHeaders });
}

export default loadMapQuestionnaire;
