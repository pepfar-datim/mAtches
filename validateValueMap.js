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
	var returnObject = {valid: true, valueSet: body.valueSet, choiceMap: {}, duplicateMappings: [], invalidMappings: []};
	var promise = new Promise(function(resolve, reject) {
		loadCsv(body.csvText).then(output => {
			var valueSetMap = body.valueSet.reduce((m,i,index) => {
				m[i.Code] = index;
				return m
			}, {});
			returnObject.valueSet = returnObject.valueSet.map(prop => {
				prop.maps = [];
				return prop
			})
			var tempChoiceMap = output.reduce((a,i) => {
				var source = i.Source.trim();
				var target = i.Target.trim();
				if (source.length > 0) {
					if (!a.hasOwnProperty(source)) { 
						//invalid if they've added target system values (e.g, added Masculin in target column)
						if (valueSetMap.hasOwnProperty(target)) {
							a[source] = target;
							returnObject.valueSet[valueSetMap[target]].maps.push(source);
						} else {
							returnObject.invalidMappings.push(target);
							returnObject.valid = false;
						}
					} else {
						//invalid if repeate source system values
						returnObject.duplicateMappings.push(source);
						returnObject.valid = false;
					}
				}
				return a
			}, {});
			returnObject.choiceMap = tempChoiceMap;
			resolve(returnObject);
		})		
	});
	return promise;
};

module.exports = {
	validateValueMap
};