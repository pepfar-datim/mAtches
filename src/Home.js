import React, { Component } from "react";
import HeaderBar from "./HeaderBar.js";

class Home extends Component {

	render() {
		return (
			<div>
				<HeaderBar config={this.props.config} />
				<h1>mAppr Home!</h1>
			</div>
		);
	}
}
export default Home;