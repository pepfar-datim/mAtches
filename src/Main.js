import React, { Component } from 'react';
import {Route, Switch } from 'react-router-dom';

import Home from './Home.js';
import MapDashboard from './MapDashboard.js';
import MapUpdate from './MapUpdate.js';

const config = {
	name: "Tanzania Ministry of Health"	
}

class Main extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loggedIn: true
		};
	}

	render() {
		return (
			<div>
		        <Switch>
		          <Route 
		          	exact path='/'
		          	render={(props) => <Home config={config} />}
		          />
		          <Route 
		          	exact path='/maps/:id'
		          	//component={MapUpdate}
		          	render={(props) => <MapUpdate  {...props} config={config} />}
		          />
		          <Route 
		          	exact path='/maps'
		          	render={(props) => <MapDashboard config={config} />}
		          />		          		          		          
		        </Switch>
			</div>
		);
	}
}

export default Main;
