import React from "react";
import {AppBar, Toolbar, Typography, IconButton} from "@material-ui/core";
import {Settings, Menu, Help} from "@material-ui/icons";
import match from '../public/images/match_color.png'; // Tell Webpack this JS file uses this image

import config from '../config.json'

import {stylesObj} from './styling/stylesObj.js';

function HeaderBar() {

	return (
		<div>
			<AppBar position="relative" style={stylesObj.headerBar}>
				<Toolbar>
					<img src={match} alt="match" />
					<Typography style={stylesObj.themePadding} variant="h5" color="inherit">
						mAtches
					</Typography>
					<Typography
						variant="h6"
						color="inherit"
					>
						{config.name}
					</Typography>
					<div style={stylesObj.headerBarRightIcons}>
						<IconButton
							edge="start"
							color="inherit"
							aria-label="menu"
							onClick={() => { window.location = config.base + 'maps/' }}
						>
							<Menu />
						</IconButton>
						<IconButton
							edge="start"
							color="inherit"
							aria-label="menu"
						>
							<Settings />
						</IconButton>
						<IconButton
							edge="start"
							color="inherit"
							aria-label="menu"
						>
							<Help />
						</IconButton>
					</div>
				</Toolbar>
			</AppBar>
		</div>
	);
}

export default HeaderBar;