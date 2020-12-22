import React, { Component } from "react";
import queryString from "query-string";
import { Redirect } from "react-router-dom";
import HeaderBar from "./HeaderBar.js";
import MapEdit from "./MapEdit.js";
import MapUpload from "./MapUpload.js";

import config from "../config.json";
import api from "./services/api.js";

import validateMap from "./services/validateMap.js";

class MapUpdate extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.state = {
      //queryString delivers object for which hasOwnProperty is removed, so make copy for hack...
      queryParams: JSON.parse(
        JSON.stringify(queryString.parse(props.location.search))
      ),
      mapID: props.match.params.id,
      map: {},
      questionnaireUID: "",
      questionnaire: {},
      mode: "",
    };
  }

  // Fetch the list on first mount
  componentDidMount() {
    var mode = "invalid";
    if (this.state.queryParams.hasOwnProperty("mode")) {
      if (this.state.queryParams.mode.toLowerCase() == "upload") {
        mode = "upload";
      }
      if (this.state.queryParams.mode.toLowerCase() == "edit") {
        mode = "edit";
      }
    }
    this.setState({ mode: mode });
  }

  render() {
    if (this.state.mode === "invalid") {
      //adding Header/MapEdit components is a hack...because redirect fails to rerender components...(not ideal approach)
      return (
        <div>
          <Redirect
            to={config.base + "maps/" + this.state.mapID + "?mode=edit"}
          />
          <HeaderBar />
          <MapEdit id={this.state.mapID} />
        </div>
      );
    } else {
      return (
        <div>
          {this.state.mode == "edit" && this.state.map && (
            <div>
              <HeaderBar />
              <MapEdit id={this.state.mapID} />
            </div>
          )}
          {this.state.mode == "upload" && (
            <div>
              <HeaderBar />
              <MapUpload id={this.state.mapID} />
            </div>
          )}
        </div>
      );
    }
  }
}

export default MapUpdate;
