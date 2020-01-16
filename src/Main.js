import React, { Component } from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';

import MapDashboard from './MapDashboard.js';
import MapUpdate from './MapUpdate.js';

import config from '../config.json'
const basePath = config.base;

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
		          	exact path={basePath}
		          	render={() => (<Redirect to={config.base + 'maps/'} />)}
		          />
		          <Route 
		          	exact path={basePath + 'maps/:id'}
		          	//component={MapUpdate}
		          	render={(props) => <MapUpdate  {...props} />}
		          />
		          <Route 
		          	exact path={basePath + 'maps'}
		          	render={(props) => <MapDashboard />}
		          />		          		          		          
		        </Switch>
			</div>
		);
	}
}

export default Main;
