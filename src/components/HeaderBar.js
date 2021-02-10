import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@material-ui/core";
import { Settings, Home, Help } from "@material-ui/icons";
import match from "../../public/images/match_color.png"; // Tell Webpack this JS file uses this image

import config from "../../config.json";

import { stylesObj } from "../styling/stylesObj";

function HeaderBar() {
  return (
    <div data-cy="headerBar">
      <AppBar position="relative" style={stylesObj.headerBar}>
        <Toolbar>
          <a href={`${config.base}maps/`}>
            <img style={stylesObj.headerLink} src={match} alt="match" />
          </a>
          <Typography
            style={{ ...stylesObj.themePadding, ...stylesObj.headerLink }}
            variant="h5"
            color="inherit"
            onClick={() => {
              window.location = `${config.base}maps/`;
            }}
          >
            {config.appName}
          </Typography>
          <Typography variant="h6" color="inherit">
            {config.name}
          </Typography>
          <div style={stylesObj.headerBarRightIcons}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => {
                window.location = `${config.base}maps/`;
              }}
            >
              <Home />
            </IconButton>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <Settings />
            </IconButton>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <Help />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default HeaderBar;
