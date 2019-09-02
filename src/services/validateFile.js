function validateFile(e,_this) {

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
			var columnRow = csvText.split('\n')[0];
			var columns = columnRow.split(',');
			checkHeaders(columns, JSON.parse(JSON.stringify(_this.props.map.map)), _this);
			resolve(true)
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

function checkHeaders(columns, map, _this) {
	let i = 0
	let invalidHeaders = [];
	for (let i = 0; i < columns.length; i++) {
		if(!map.hasOwnProperty(columns[i])) {
			invalidHeaders.push(columns[i]);
		}
		else {
			delete map[columns[i]]
		}
	}
	_this.setState({invalidHeaders: invalidHeaders, missingHeaders: Object.keys(map)})
}
export default validateFile;
