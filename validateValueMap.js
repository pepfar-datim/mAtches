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

const validateValueMap = body => {
	var returnObject = { valid: true, valueSet: [], choiceMap: {}, duplicateMappings: [], invalidMappings: []};
	var promise = new Promise(function(resolve, reject) {
		loadCsv(body.csvText).then(output => {
			console.log(body.valueSet);
			console.log(typeof body.valueSet);
			var valueSetMap = body.valueSet.reduce((m,i,index) => {
				m[i.Code] = index;
				return m
			}, {});
			var tempChoiceMap = output.reduce((a,i) => {
				if (!a.hasOwnProperty(a[i.Source])) { 
					//invalid if they've added target system values (e.g, added Masculin in target column)
					if (valueSetMap.hasOwnProperty(i.Target)) {
						a[i.Source] = i.Target; 	
					} else {
						returnObject.invalidMappings.push(i);
						returnObject.valid = false;
					}
					
				} else {
					//invalid if repeate source system values
					returnObject.duplicateMappings.push(i)
					returnObject.valid = false;
				}
				return a
			}, {});
			
    		
			resolve(returnObject);	
		})		
	});
	return promise;
};

module.exports = {
	validateValueMap
};