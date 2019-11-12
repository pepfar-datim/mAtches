export function uploadFile(e,_this) {

	return new Promise((resolve, reject) => {	
		let files;

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

export function checkHeaders(csvFile, map) {
	var columnRow = csvFile.split('\n')[0];
	var columns = columnRow.split(',');
	let i = 0
	let invalidHeaders = [];
	for (let i = 0; i < columns.length; i++) {
		if(!map.hasOwnProperty(columns[i].trim())) {
			invalidHeaders.push(columns[i].trim());
		}
		else {
			delete map[columns[i].trim()]
		}
	}
	var validity = true;
	if (Object.keys(map).length>0) {
		validity = false;
	}
	
	return({validity: validity, invalidHeaders: invalidHeaders, missingHeaders: Object.keys(map), text: csvFile})
}
export default {uploadFile, checkHeaders}
