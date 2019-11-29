const csv = require("csv");

const loadCsv = rawData => {
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
};

const validateValueMap = csvText => {
	var returnObject = { valid: true, valueSet: [], choiceMap: {} };
	var promise = new Promise(function(resolve, reject) {
		loadCsv(csvText).then(output => {
			var tempChoiceMap = output.reduce((a,i) => {
				if (!a.hasOwnProperty(a[i.Source])) { 
					a[i.Source] = i.Target; 
				} else {
					//invalid if repeate source system values
					returnObject.valid = false;
				}
				return a
			}, {})
			//invalid if they've added target system values (e.g, added Masculin in target column)
    		
			resolve(returnObject);	
		})		
	});
	return promise;
};

module.exports = {
	validateValueMap
};