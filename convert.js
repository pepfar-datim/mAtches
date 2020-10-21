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
          if (this.map.headers[key].valueType == "choice") {
            tempValue = this.convertValue(
              tempValue,
              this.map.headers[key].choiceMap,
              i,
              key
            );
          } else {
            tempValue.value = this.evaluateValue(
              this.csvData[i][key],
              tempValue.valueType,
              i,
              key
            );
          }
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
      });
      Object.keys(this.map.constants).forEach(key => {
      	let tempValue = {value: this.map.constants[key].code, valueType: this.map.constants[key].valueType};
      	//there could be collision in keys between constants and headers here (though unlikely)
      	tempValue.value = this.evaluateValue(tempValue.value, tempValue.valueType, i, key)
      	this.addQRItems(QR.item, this.map.constants[key].path, pathsChecked, tempValue.value, tempValue.valueType.charAt(0).toUpperCase() + tempValue.valueType.slice(1));
      })
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

const convertToFHIR = (csvText, map, mapID, questionnaireURL) => {
  data.map = map.map;
  data.csvData = [];
  data.errors = {};
  data.rowErrors = {};
  data.QuestionnaireResponses = [];
  data.questionnaireURL = questionnaireURL;

  var end = { status: 400, message: "Something went wrong" };
  var promise = new Promise(function(resolve, reject) {
    data.uploadDate = new Date().toISOString();
    data.mapDate = mapID + "-" + data.uploadDate;
    data.loadCsv(csvText).then(output => {
      if (!Array.isArray(output)) {
        end = { status: 200, message: "Invalid CSV File" };
      } else {
        data.csvData = output;
        data.convertToQR();
        end = { status: 200, message: "Converted" };

        if (Object.keys(data.errors).length > 0) {
          end.errors = data.errors;
        } else {
          end.data = data.bundle;
        }
        resolve(end);
      }
    });
  });
  return promise;
};

module.exports = {
  convertToFHIR
};