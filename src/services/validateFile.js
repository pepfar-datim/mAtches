export function uploadFile(e,_this) {

	return new Promise((resolve, reject) => {	
		let files = [];

	    if (e.dataTransfer && e.dataTransfer.files) {
	      files = e.dataTransfer.files;
	    } else if (e.target) {
	      files = e.target.files;
	    }
		
		if (typeof files !== "object" || files.length === 0){
			resolve(false)
		}
		
		_this.setState({fileName: files[0].name})

		readFileContent(files[0]).then((csvText) => {
			resolve(csvText)
		})
	    
	})
}

function readFileContent(file) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = event => resolve(event.target.result);
    reader.onerror = error => reject(error);
    reader.readAsText(file);
  });
}

export function checkHeadersGeneral(actualHeaders, desiredHeaders) {
	var duplicates = false;
	var missingHeaders = [];

	actualHeaders = actualHeaders.reduce((a, h) => {
		if (a.hasOwnProperty(h)) {duplicates = true}
		a[h] = true;
		return a
	}, {});
	
	for (var h of desiredHeaders) {
		if (actualHeaders.hasOwnProperty(h)) {
			delete actualHeaders[h];
		} else {
			missingHeaders.push(h)
		}
	}

	var validity = duplicates ? false : (missingHeaders.length > 0 ? false : true);
	return ({"valid": validity, "extraHeaders": Object.keys(actualHeaders)});


}

export function checkHeaders(csvFile, mapHeaders) {
	var columnRow = csvFile.split('\n')[0];
	var columns = columnRow.split(',');
	let i = 0
	let invalidHeaders = [];
	for (let i = 0; i < columns.length; i++) {
		if(!mapHeaders.hasOwnProperty(columns[i].trim())) {
			invalidHeaders.push(columns[i].trim());
		}
		else {
			delete mapHeaders[columns[i].trim()]
		}
	}
	var validity = true;
	if (Object.keys(mapHeaders).length>0) {
		validity = false;
	}
	
	return({validity: validity, invalidHeaders: invalidHeaders, missingHeaders: Object.keys(mapHeaders), text: csvFile})
}
export default {uploadFile, checkHeaders}
