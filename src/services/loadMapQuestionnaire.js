import validateMap from "./validateMap.js";

import api from "./api.js";

function loadMapQuestionnaire(mapID, _this) {
  getSpecificMap(mapID, _this);
}

function getSpecificMap(id, _this) {
  api
    .get(`api/maps/${id}`)
    .then((map) => {
      _this.setState({ map, mapValidity: map.complete });
      extractUnmappedHeaders(map.map, _this);
      const questionnaireUID = map.questionnaireuid;
      _this.setState({ questionnaireUID });
      return questionnaireUID;
    })
    .then((questionnaireUID) => {
      getSpecificQuestionnaire(questionnaireUID, _this);
    })

    .catch((e) => {
      _this.setState({ failedToLoad: true, loading: false });
    });
}

function getSpecificQuestionnaire(id, _this) {
  api
    .get(`api/questionnaires/${encodeURIComponent(id)}`)
    .then((questionnaire) => {
      if (questionnaire.hasOwnProperty("message")) {
        _this.setState({ failedToLoad: questionnaire.message, loading: false });
      }
      _this.setState({ questionnaire });
      let mapCheck = {};
      mapCheck = validateMap(_this.state.map, questionnaire);
      _this.setState({ mapCheck, loading: false });
    });
}

function extractUnmappedHeaders(map, _this) {
  const tempUnmappedHeaders = {};
  for (const k in map.headers) {
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
