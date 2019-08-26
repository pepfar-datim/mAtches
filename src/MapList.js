import React from "react";
import MaterialTable from 'material-table'

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

function MapList(props) {
	var maps = props.maps;
	var questionnaireHash = props.questionnaireHash;
	return (
		<div style={{padding: '20px'}}>
	        <MaterialTable

		        title="My maps"
		        icons={tableIcons}
		        columns={[
		          { title: 'Name', field: 'name' },
		          { title: 'Questionnaire', field: 'questionnaireuid', lookup: questionnaireHash },
		          { title: 'Updated', field: 'updated', type: 'numeric' }
		        ]}
		        data={maps}
		        actions={[
		          {
		            icon: tableIcons.Edit,
		            tooltip: 'Edit Map',
		            onClick: (event, rowData) => {window.location = '/maps/' + rowData.uid + "?mode=edit"}
		          },
		          rowData => ({
		            icon: tableIcons.Upload,
		            tooltip: 'Upload to map',
		            onClick: (event, rowData) => {window.location = '/maps/' + rowData.uid + "?mode=upload"},
		            disabled: rowData.map === null
		          }),
		          {
		            icon: tableIcons.Delete,
		            tooltip: 'Delete Map',
		          },		          
		        ]}		                
		        options={{
		          search: true,
		          actionsColumnIndex: -1
		        }}

 
	        />
	    </div>
	);
}

export default MapList;