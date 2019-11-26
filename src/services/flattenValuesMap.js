function flattenValuesMap(tempValueSet) {

	var modified = tempValueSet.flatMap(k => 
	(k.maps.length > 0) ? k.maps.flatMap(m => [[k.Code,m]]) 
	: [[k.Code,'']]
	);
	modified.unshift(['Target', 'Source'])
	return modified;
}

export default flattenValuesMap;