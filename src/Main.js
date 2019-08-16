import React, { Component } from 'react';
import {Route, Switch } from 'react-router-dom';

import Home from './Home.js';
import MapDashboard from './MapDashboard.js';
import MapUpdate from './MapUpdate.js';

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
		          <Route exact path='/' component={Home}/>
		          <Route exact path='/maps/:id' component={MapUpdate}/>
		          <Route path='/maps' component={MapDashboard}/>
		        </Switch>
			</div>
		);
	}
}

export default Main;
