import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {AppBar, Toolbar, Typography, IconButton} from "@material-ui/core";
import {Settings, Menu, Help} from "@material-ui/icons";
import match from '../public/images/match_color.png'; // Tell Webpack this JS file uses this image

import config from '../config.json'

const useStyles = makeStyles({
	root: {
		padding: "0px",
		margin: "0px",
		width: "100%"
	}
});

function HeaderBar() {
	const classes = useStyles();

	return (
		<div>
			<AppBar position="relative" color="default">
				<Toolbar>
					<img src={match} alt="match" />
					<Typography style={{padding: "20px"}} variant="h5" color="inherit">
						mAtches
					</Typography>
					<Typography
						variant="h6"
						color="inherit"
					>
						{config.name}
					</Typography>
					<div style={{ position: "absolute", right: "0px" }}>
						<IconButton
							edge="start"
							className={classes.menuButton}
							color="inherit"
							aria-label="menu"
							onClick={() => { window.location = config.base + 'maps/' }}
						>
							<Menu />
						</IconButton>
						<IconButton
							edge="start"
							className={classes.menuButton}
							color="inherit"
							aria-label="menu"
						>
							<Settings />
						</IconButton>
						<IconButton
							edge="start"
							className={classes.menuButton}
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