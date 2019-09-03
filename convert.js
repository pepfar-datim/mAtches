const csv = require("csv");

var data = {
  csvData: [],
  errors: {},
  QuestionnaireResponses: [],
  map: {},
  mapDate: "",
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
        item: []
      };
      var pathsChecked = {};
      Object.keys(this.csvData[i]).forEach(key => {
        this.evaluateValue(this.csvData[i][key], this.map[key]["valueType"], i, key);
        var tempValue = this.csvData[i][key];
        if (this.map[key]["valueType"] == "choice") {
          tempValue = this.convertValue(
            tempValue,
            this.map[key]["choiceMap"],
            i,
            key
          );
        }
        this.addQRItems(
          QR["item"],
          this.map[key]["path"],
          pathsChecked,
          tempValue,
          this.map[key]["valueType"].charAt(0).toUpperCase() +
            this.map[key]["valueType"].slice(1)
        );
      });
      if (!this.errors.hasOwnProperty(i)) {
        this.QuestionnaireResponses.push(QR);
      }
    }
  },
  evaluateValue: function(value, valueType, row, key) {
    //this function would evaluate value and push an error to this.errors if invalid
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
      if (!this.errors.hasOwnProperty(row)) {
        this.errors[row] = {};
      }
      if (!this.errors[row].hasOwnProperty(key)) {
        this.errors[row][key] = {};
      }
      this.errors[row][key]["invalidValueMapping"] = true;
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
      tempObject[indexPosition]["answer"][valueName] = value;
    }
  }
};

const convertToFHIR = (csvText, map, mapID) => {
  data.map = map.map;
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
        end = {status: 200, message: "Converted", errors: data.errors, data: data.QuestionnaireResponses};  
      }
      resolve(end)
    })
  })
  return promise
}

module.exports = {
  convertToFHIR
}