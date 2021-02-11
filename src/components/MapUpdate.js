import React, { Component } from "react";
import PropTypes from "prop-types";
import queryString from "query-string";
import { Redirect } from "react-router-dom";
import HeaderBar from "./HeaderBar";
import MapEdit from "./MapEdit";
import MapUpload from "./MapUpload";

import config from "../../config.json";

class MapUpdate extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    const { location, match } = props;
    this.state = {
      // queryString delivers object for which hasOwnProperty is removed, so make copy for hack...
      queryParams: JSON.parse(
        JSON.stringify(queryString.parse(location.search))
      ),
      mapID: match.params.id,
      map: {},
      mode: "",
    };
  }

  // Fetch the list on first mount
  componentDidMount() {
    const { queryParams } = this.state;
    let mode = "invalid";
    if (queryParams.mode) {
      if (queryParams.mode.toLowerCase() === "upload") {
        mode = "upload";
      }
      if (queryParams.mode.toLowerCase() === "edit") {
        mode = "edit";
      }
    }
    this.setState({ mode });
  }

  render() {
    const { map, mapID, mode } = this.state;
    if (mode === "invalid") {
      // adding Header/MapEdit components is a hack...because redirect fails to rerender components...(not ideal approach)
      return (
        <div>
          <Redirect to={`${config.base}maps/${mapID}?mode=edit`} />
          <HeaderBar />
          <MapEdit id={mapID} />
        </div>
      );
    }
    return (
      <div>
        {mode === "edit" && map && (
          <div>
            <HeaderBar />
            <MapEdit id={mapID} />
          </div>
        )}
        {mode === "upload" && (
          <div>
            <HeaderBar />
            <MapUpload id={mapID} />
          </div>
        )}
      </div>
    );
  }
}

MapUpdate.propTypes = {
  location: PropTypes.objectOf(PropTypes.object).isRequired,
  match: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default MapUpdate;
