import React, { Component } from "react";
import MaterialTable from "material-table";
import Typography from '@material-ui/core/Typography';

import config from "../config.json";
import SearchTextComponent from "./SearchTextComponent.js";

import { forwardRef } from "react";

import {DebounceInput} from 'react-debounce-input';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import IconButton from "@material-ui/core/IconButton";


import AddBox from "@material-ui/icons/AddBox";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import Upload from "@material-ui/icons/PublishOutlined";
import ViewColumn from "@material-ui/icons/ViewColumn";

const tableIcons = {
	Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
	Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
	Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
	Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
	DetailPanel: forwardRef((props, ref) => (
		<ChevronRight {...props} ref={ref} />
	)),
	Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
	Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
	Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
	FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
	LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
	NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
	PreviousPage: forwardRef((props, ref) => (
		<ChevronLeft {...props} ref={ref} />
	)),
	ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
	Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
	SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
	ThirdStateCheck: forwardRef((props, ref) => (
		<Remove {...props} ref={ref} />
	)),
	Upload: forwardRef((props, ref) => <Upload {...props} ref={ref} />),
	ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

function formatMapList(maps, searchText, currentMapID) {
	return maps
		.filter(m => {
			if (m.uid == currentMapID) {return false}
			if (!searchText.length) {return true}
			return m.name.toLowerCase().includes(searchText.trim().toLowerCase())
		})
		.slice(0,4)
		.map(function(k, i) {
			return (
				<div>
					<Grid container spacing={1} alignItems="flex-end">
          				<Grid item>
            				<Upload/>
          				</Grid>
          				<Grid item>
            				<Typography align="top">{k.name}</Typography>
          				</Grid>
        			</Grid>					
				</div>
			)
	});
}

class UploadMapList extends Component {
	// Initialize the state
	constructor(props) {
		super(props);
		this.state = {
			maps: [],
			searchText: ''
		};
	}

	// Fetch the list on first mount
	componentDidMount() {
		this.getMaps();
	}

	getMaps() {
		fetch(config.base + "api/maps")
			.then(res => res.json())
			.then(maps => {
				this.setState({ maps: maps });
			});
	}
		
/*
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
//preferably, could get debounce to work with this, but it's not registering change...
		    <DebounceInput
		        	element={SearchTextComponent}
		        	debounceTimeout={300}
		        	onChange={event => console.log(event)} 
		    />
			        
*/
	render() {
		return (
			<div style={{ padding: "10px" }}>		    

		    <TextField
				id="narrowdown-search"
				label="Narrow down maps"
				onChange={e => this.setState({searchText: e.target.value})}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<Search />
						</InputAdornment>
					)
				}}
			/>
			<br />
			<br />
				{formatMapList(this.state.maps, this.state.searchText, this.props.id)}
			</div>
		);
	}
}

export default UploadMapList;