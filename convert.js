const csv = require("csv");
const moment = require("moment");

var data = {
  loadCsv: function(rawData) {
    var promise = new Promise(function(resolve, reject) {
      csv.parse(
        rawData,
        {
          columns: true,
          trim: true,
          skip_empty_lines: true
        },
        function(err, output) {
          if (err) {
            resolve({ error: err });
          }
          resolve(output);
        }
      );
    });
    return promise;
  },
  loadJSON: function(rawData) {
    formattedData = JSON.parse(rawData);
    if (!Array.isArray(formattedData)) {
      formattedData = [formattedData]
    }
    return formattedData
  },
  addInConstants: function(row, QR, pathsChecked) {
    Object.keys(this.map.constants).forEach(key => {
      let tempValue = {value: this.map.constants[key].code, valueType: this.map.constants[key].valueType};
      //there could be collision in keys between constants and headers here (though unlikely)
      tempValue.value = this.evaluateValue(tempValue.value, tempValue.valueType, row, key)
      this.addQRItems(QR.item, this.map.constants[key].path, pathsChecked, tempValue.value, tempValue.valueType.charAt(0).toUpperCase() + tempValue.valueType.slice(1));
    })
  },
  convertToQR: function() {
    for (let i = 0; i < this.csvData.length; i++) {
      var QR = {
        resourceType: "QuestionnaireResponse",
        id: this.mapDate + "-row" + i,
        status: "completed",
        questionnaire: this.questionnaireURL,
        item: []
      };
      var pathsChecked = {};
      Object.keys(this.csvData[i]).forEach(key => {
        if (this.map.headers.hasOwnProperty(key)) {
          var tempValue = {valueType: this.map.headers[key].valueType, value: this.csvData[i][key]};
          var requiredItem = this.map.headers[key].path[this.map.headers[key].path.length - 1].required || false
          // if item is required or if item is not blank, process
          if (requiredItem || tempValue.value.trim().length) {
            tempValue = this.prepareTempValue(this.map.headers[key].valueType, tempValue, i, key, this.csvData[i][key])
            if (tempValue) {
              this.addQRItems(
                QR.item,
                this.map.headers[key].path,
                pathsChecked,
                tempValue.value,
                tempValue.valueType.charAt(0).toUpperCase() +
                  tempValue.valueType.slice(1)
              );
            }
          }
        }
      });
      this.addInConstants(i, QR, pathsChecked);
      if (!this.rowErrors.hasOwnProperty(i)) {
        this.QuestionnaireResponses.push(QR);
      }
    }
    this.convertToBundle();
  },
  convertToQRJSON: function() {
    for (let i=0; i<this.jsonData.length; i++) {

      var QR = {
        resourceType: "QuestionnaireResponse",
        id: this.mapDate + "-row" + i,
        status: "completed",
        questionnaire: this.questionnaireURL,
        item: []
      };
      var pathsChecked = {};      

      for (header in this.map.headers) {
        let individualValue = accessValue(this.jsonData[i], this.map.headers[header].headerPath);
        
        let requiredItem = this.map.headers[header].path[this.map.headers[header].path.length - 1].required || false

        if (individualValue === undefined && requiredItem) {
          this.addError(i, header, "valueMissing");
        } else if(individualValue) {
          let tempValue = {valueType: this.map.headers[header].valueType, value: individualValue};
          tempValue = this.prepareTempValue(this.map.headers[header].valueType, tempValue, i, header, individualValue)
            if (tempValue) {
              this.addQRItems(
                QR.item,
                this.map.headers[header].path,
                pathsChecked,
                tempValue.value,
                tempValue.valueType.charAt(0).toUpperCase() +
                  tempValue.valueType.slice(1)
              );
            }
        }        
      }
      this.addInConstants(i, QR, pathsChecked);
      if (!this.rowErrors.hasOwnProperty(i)) {
        this.QuestionnaireResponses.push(QR);
      }      
    }
    this.convertToBundle();
  },
  convertToBundle: function() {
    if (this.QuestionnaireResponses.length > 0) {
      this.bundle = {
        "resourceType": "Bundle",
        "id": "auto-generated",
        "meta": {
          "profile": ["http://datim.org/fhir/StructureDefinition/PLM-QuestionnaireResponse-Bundle"]
        },
        "type": "message",
        "timestamp": this.uploadDate,
        "entry": []

      }
    }
    for (let i=0; i<this.QuestionnaireResponses.length; i++) {
      this.bundle.entry.push ({"resource": this.QuestionnaireResponses[i]})
    }
  },
  evaluateValue: function(value, valueType, row, key) {
    try {
      switch (valueType) {
        case "integer":
          if (Number.isInteger(parseFloat(value.trim()))) {
            return parseInt(value.trim());
          } else {
            this.addError(row, key, "invalidValueType");
          }
        case "dateTime":
          if (moment(value, moment.ISO_8601, true).isValid()) {
            return value;
          } else {
            this.addError(row, key, "invalidValueType");
          }
        case "date":
          if (moment(value, moment.ISO_8601, true).isValid()) {
            return value;
          } else {
            this.addError(row, key, "invalidValueType");
          }
        default:
          return value;
      }
    } catch (e) {
      console.log(e);
      this.addError(row, key, "invalidValueType");
    }
  },
  addError: function(row, key, type, value) {
    if (!this.rowErrors.hasOwnProperty(row)) {
      this.rowErrors[row] = true;
    }
    if (!this.errors.hasOwnProperty(key)) {
      this.errors[key] = {};
    }
    if (!this.errors[key].hasOwnProperty(type)) {
      this.errors[key][type] = [];
      if (type == "invalidValueMapping") {
        this.errors[key][type] = {};
      }
    }
    if (type == "invalidValueMapping") {
      this.errors[key][type][value] = {};
    } else {
      this.errors[key][type].push(row);
    }
  },
  prepareTempValue: function(valueType, tempValue, i, key, individualValue) {
    if (valueType == "choice") {
      tempValue = this.convertValue(
        tempValue,
        this.map.headers[key].choiceMap,
        i,
        key
      );
    } else {
      tempValue.value = this.evaluateValue(
        individualValue,
        tempValue.valueType,
        i,
        key
      );
    }
    return tempValue
  },
  convertValue: function(valueObject, valueChoiceMap, row, key) {
    //if there is an error in mapping the value (e.g. map missing, then push error), else convert
    try {
      if (valueChoiceMap == undefined) {
        throw new Error("Missing a map for values");
      }
      if (!valueChoiceMap.hasOwnProperty(valueObject.value)) {
        throw new Error("Unmapped choice value");
      }
      return {value: valueChoiceMap[valueObject.value].code, valueType: valueChoiceMap[valueObject.value].valueType};
    } catch (e) {
      this.addError(row, key, "invalidValueMapping", valueObject.value);
      return undefined
    }
  },
  addQRItems: function(tempObject, pathArray, pathsChecked, value, valueType) {
    var indexPosition = 0;
    if (!pathsChecked.hasOwnProperty(pathArray[0].linkid)) {
      pathsChecked[pathArray[0].linkid] = {};
      var newItem = {};

      newItem.linkId = pathArray[0].linkid;
      newItem.text = pathArray[0].text;
      if (pathArray.length > 1) {
        newItem.item = [];
      }

      tempObject.push(newItem);
    }

    //find the appropriate index position for the given linkID
    for (let i = 0; i < tempObject.length; i++) {
      if (pathArray[0].linkid == tempObject[i].linkId) {
        indexPosition = i;
        break;
      }
    }
    //call recursively if not last item in path, otherwise push value
    if (pathArray.length > 1) {
      this.addQRItems(
        tempObject[indexPosition].item,
        pathArray.slice(1),
        pathsChecked[pathArray[0].linkid],
        value,
        valueType
      );
    } else {
      tempObject[indexPosition].answer = [{}];
      var valueName = "value" + valueType;
      if (valueName == "valueChoice") {
        tempObject[indexPosition].answer[0].valueCoding = { code: value };
      } else {
        tempObject[indexPosition].answer[0][valueName] = value;
      }
    }
  }
};

const convertToFHIR = (dataText, map, mapID, questionnaireURL) => {

  let end = { status: 400, message: "Something went wrong" };

  try {
    data.map = map.map;
    data.csvData = [];
    data.jsonData = {};
    data.errors = {};
    data.rowErrors = {};
    data.QuestionnaireResponses = [];
    data.questionnaireURL = questionnaireURL;

    var promise = new Promise(function(resolve, reject) {
      data.uploadDate = new Date().toISOString();
      data.mapDate = mapID + "-" + data.uploadDate;
      console.log(map)
      if (map.fileType == 'json') {
        let output = data.loadJSON(dataText);
        data.jsonData = output;
        data.convertToQRJSON();
        resolve(populateResponse())
      } else {
        data.loadCsv(dataText).then(output => {
          if (!Array.isArray(output)) {
            end = { status: 200, message: "Invalid CSV File" };
          } else {
            data.csvData = output;
            data.convertToQR();
            resolve(populateResponse())
          }
        });
      }
    });
    return promise;
  } catch (e) {
    console.log(e);
    return(end)
  }

};

const populateResponse = () => {
  let end = { status: 200, message: "Converted" };
  if (Object.keys(data.errors).length > 0) {
    end.errors = data.errors;
  } else {
    end.data = data.bundle
  }
  return(end)
};

const accessValue = (tempObj, path) => {
  try {
    if (path.length == 1) {
      return tempObj[path[0]]
    } else {
      return accessValue(tempObj[path[0]],path.slice(1))
    }   
  } catch(e) {
      return undefined
  } 
}

module.exports = {
  convertToFHIR
};