import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from "@material-ui/icons/Settings";
import MenuIcon from "@material-ui/icons/Menu";
import HelpIcon from "@material-ui/icons/Help";
import LanguageIcon from "@material-ui/icons/Language";

const useStyles = makeStyles({
	root: {
		padding: "0px",
		margin: "0px",
		width: "100%"
	}
});

function HeaderBar(props) {
	const classes = useStyles();

	return (
		<div>
			<AppBar position="static" color="default">
				<Toolbar>
					<LanguageIcon/>
					<Typography style={{padding: "20px"}} variant="h5" color="inherit">
						mAppr
					</Typography>
					<Typography
						variant="h6"
						color="inherit"
					>
						{props.config.name}
					</Typography>
					<div style={{ position: "absolute", right: "0px" }}>
						<IconButton
							edge="start"
							className={classes.menuButton}
							color="inherit"
							aria-label="menu"
						>
							<MenuIcon />
						</IconButton>
						<IconButton
							edge="start"
							className={classes.menuButton}
							color="inherit"
							aria-label="menu"
						>
							<SettingsIcon />
						</IconButton>
						<IconButton
							edge="start"
							className={classes.menuButton}
							color="inherit"
							aria-label="menu"
						>
							<HelpIcon />
						</IconButton>
					</div>
				</Toolbar>
			</AppBar>
		</div>
	);
}

export default HeaderBar;