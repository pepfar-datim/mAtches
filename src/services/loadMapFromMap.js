function checkFQ(flatQuestionnaire, path, linkid) {
  let validity = false;
  if (flatQuestionnaire.hasOwnProperty(linkid)) {
    // objects should be the same format, but this is an assumption of ease and not really valid, so should rewrite
    if (
      JSON.stringify(flatQuestionnaire[linkid].path) == JSON.stringify(path)
    ) {
      validity = true;
    }
  }

  return validity;
}

function loadMapFromMap(flatQuestionnaire, baseMap, newMap, unmappedHeaders) {
  const returnObj = {};
  for (const header in baseMap.map.headers) {
    if (!newMap.map.headers.hasOwnProperty(header)) {
      newMap.map.headers[header] = {};
      unmappedHeaders[header] = {};
    }

    if (baseMap.map.headers[header].hasOwnProperty("path")) {
      const { linkid } = baseMap.map.headers[header].path.slice(-1)[0];
      const match = checkFQ(
        flatQuestionnaire,
        baseMap.map.headers[header].path,
        linkid
      );

      if (match) {
        // if there is a match to Questionnaire, copy properties from Base Map and make association
        const propertiesToCopy = ["path", "valueType", "choiceMap"];
        for (let i = 0; i < propertiesToCopy.length; i++) {
          if (baseMap.map.headers[header].hasOwnProperty(propertiesToCopy[i])) {
            newMap.map.headers[header][propertiesToCopy[i]] = JSON.parse(
              JSON.stringify(baseMap.map.headers[header][propertiesToCopy[i]])
            );
          }
        }

        // remove existing association in flatQuestionnaire from map (if different header)
        if (flatQuestionnaire[linkid].hasOwnProperty("header")) {
          if (
            newMap.map.headers.hasOwnProperty(
              flatQuestionnaire[linkid].header
            ) &&
            flatQuestionnaire[linkid].header != header
          ) {
            delete newMap.map.headers[flatQuestionnaire[linkid].header];
          }
        }

        // update association in flatQuestionnaire
        flatQuestionnaire[linkid].header = header;

        // and delete from unmapped headers
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
