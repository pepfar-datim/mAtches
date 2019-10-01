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
          if (err) {resolve({"error": err})}
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
        var tempValue = this.csvData[i][key];
        if (this.map.hasOwnProperty(key)) {
          if (this.map[key]["valueType"] == "choice") {
            tempValue = this.convertValue(
              tempValue,
              this.map[key]["choiceMap"],
              i,
              key
            );
          }
          else {
            tempValue = this.evaluateValue(this.csvData[i][key], this.map[key]["valueType"], i, key);
          }
          this.addQRItems(
            QR["item"],
            this.map[key]["path"],
            pathsChecked,
            tempValue,
            this.map[key]["valueType"].charAt(0).toUpperCase() +
              this.map[key]["valueType"].slice(1)
          );
        }
      });
      if (!this.rowErrors.hasOwnProperty(i)) {
        this.QuestionnaireResponses.push(QR);
      }
    }
  },
  evaluateValue: function(value, valueType, row, key) {
    try {
      switch (valueType) {
        case 'integer':          
          if (Number.isInteger(parseFloat(value.trim()))) {
            return parseInt(value.trim());
          }
          else {
            this.addError(row, key, 'invalidValueType');
          }
        case 'dateTime':
          if(moment(value, moment.ISO_8601, true).isValid()) {
            return value
          }
          else {
            this.addError(row, key, 'invalidValueType');
          }
        case 'date':
          if(moment(value, moment.ISO_8601, true).isValid()) {
            return value
          }
          else {
            this.addError(row, key, 'invalidValueType');
          }          
      }
    } catch (e) {
      console.log(e)
      this.addError(row, key, 'invalidValueType');
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
        if (type == 'invalidValueMapping') {
         this.errors[key][type] = {};
        }
      }
      if (type == 'invalidValueMapping') {
       this.errors[key][type][value] = {};
      }
      else {
        this.errors[key][type].push(row)  
      }     
      
  },
  convertValue: function(value, valueMapLocation, row, key) {
    //if there is an error in mapping the value (e.g. map missing, then push error), else convert
    try {
      if (!this.map[key].hasOwnProperty('choiceMap')) {
        throw new Error('Missing a map for values')
      }
      var valueMap = this.map[key]['choiceMap']
      if (valueMap[value] === undefined) {
        throw new Error("Unmapped choice value");
      }
      return valueMap[value];
    } catch (e) {
      this.addError(row, key, 'invalidValueMapping', value);
    }
  },
  addQRItems: function(tempObject, pathArray, pathsChecked, value, valueType) {
    var indexPosition = 0;
    if (!pathsChecked.hasOwnProperty(pathArray[0]["linkid"])) {
      pathsChecked[pathArray[0]["linkid"]] = {};
      var newItem = {};

      newItem["linkId"] = pathArray[0]["linkid"];
      newItem["text"] = pathArray[0]["text"];
      if (pathArray.length > 1) {
        newItem["item"] = [];
      }

      tempObject.push(newItem);
    }

    //find the appropriate index position for the given linkID
    for (let i = 0; i < tempObject.length; i++) {
      if (pathArray[0]["linkid"] == tempObject[i]["linkId"]) {
        indexPosition = i;
        break;
      }
    }
    //call recursively if not last item in path, otherwise push value
    if (pathArray.length > 1) {
      this.addQRItems(
        tempObject[indexPosition]["item"],
        pathArray.slice(1),
        pathsChecked[pathArray[0]["linkid"]],
        value,
        valueType
      );
    } else {
      tempObject[indexPosition]["answer"] = {};
      var valueName = "value" + valueType;
      if (valueName == "valueChoice") {
        tempObject[indexPosition]["answer"]["valueCoding"] = {choice: value}  
      }
      else {
        tempObject[indexPosition]["answer"][valueName] = value;  
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

  var end = {status: 400, message: "Something went wrong"};
  var promise = new Promise(function(resolve, reject) {
    var uploadDate = new Date().toISOString();
    data.mapDate = mapID + "-" + uploadDate;
    data.loadCsv(csvText).then(output => {
      if (!Array.isArray(output)) {
        end = {status: 200, message: "Invalid CSV File"};
      }
      else {
        data.csvData = output;
        data.convertToQR();
        end = {status: 200, message: "Converted"};

        if(Object.keys(data.errors).length>0) {
          end.errors=data.errors
        }
        else {
          end.data=data.QuestionnaireResponses;
        }
        resolve(end)
      }
    })
  })
  return promise
}

module.exports = {
  convertToFHIR
}