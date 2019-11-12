import React, { Component } from "react";
import MaterialTable from 'material-table'

import config from '../config.json'

import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import Upload from '@material-ui/icons/PublishOutlined';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
Upload: forwardRef((props, ref) => <Upload {...props} ref={ref} />),
ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

class UploadMapList extends Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.state = {
      maps: []
    }
  }

  // Fetch the list on first mount
  componentDidMount() {
    this.getMaps();
  }

  // Retrieves the list of items from the Express app
  getMaps() {
    fetch(config.base + 'api/maps')
    .then(res => res.json())
    .then(maps => {
      this.setState({"maps": maps })
    })  
  }

	render() {
	return (
		<div style={{padding: '10px'}}>
	        <MaterialTable
	        	width="50"
		        title=""
		        icons={tableIcons}
		        columns={[
		          { title: 'Name', field: 'name' },
		        ]}
		        data={this.state.maps}
		        actions={[
		          rowData => ({
		            icon: tableIcons.Upload,
		            tooltip: 'Process',
		            onClick: (event, rowData) => {this.props.onMapProcess(rowData.map);},
		          })		          
		        ]}		                
		        options={{
		          search: true,
		          actionsColumnIndex: -1
		        }}

 
	        />
	    </div>
	);
}	
}

export default UploadMapList;