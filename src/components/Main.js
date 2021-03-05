import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import MapDashboard from "./MapDashboard";
import MapUpdate from "./MapUpdate";
import LogicMapDialog from "./LogicMapDialog"

import classes from '../styling/Main.module.css'
import config from "../../config.json";

const basePath = config.base;

const testNode = {key: 'names', items: [{key: "0", items:[{key: 'apples'},{key: 'pears'}]}]}

export default function Main() {
  return (
    <LogicMapDialog
      node={testNode}
      handleClose={()=>{console.log('close this')}}
    />
  )
}

/*
export default function Main() {
  return (
    <div className={classes.Main}>
      <Switch>
        <Route
          exact
          path={basePath}
          render={() => <Redirect to={`${basePath}maps`} />}
        />
        <Route
          exact
          path={`${basePath}maps/:id`}
          render={(props) => (
            <MapUpdate location={props.location} match={props.match} />
          )}
        />
        <Route exact path={`${basePath}maps`} render={() => <MapDashboard />} />
      </Switch>
    </div>
  );
}
*/