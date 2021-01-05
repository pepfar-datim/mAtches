import React, { Component } from "react";
import { CircularProgress, Typography } from "@material-ui/core";
import HeaderBar from "./HeaderBar";
import MapList from "./MapList";
import MapAdd from "./MapAdd";

import api from "./services/api";

import { stylesObj } from "./styling/stylesObj";

class MapDashboard extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  // Fetch the list on first mount
  componentDidMount() {
    this.getQuestionnaires();
  }

  getQuestionnaires() {
    api
      .get("api/questionnaires")
      .then((questionnaires) => {
        const questionnaireHash = questionnaires.reduce(
          (mappedQs, q) => ({ ...mappedQs, [q.resource.url]: q.resource.name }),
          {}
        );
        this.setState({ questionnaireHash, loading: false });
      })
      .catch((e) => {
        console.log(e);
        this.setState({
          failedToLoad: "Failed to load questionnaires from FHIR Server",
          loading: false,
        });
      });
  }

  render() {
    const { loading, failedToLoad, questionnaireHash } = this.state;
    return (
      <>
        <HeaderBar />
        {loading ? (
          <CircularProgress style={stylesObj.loaderStyling} />
        ) : (
          <>
            {failedToLoad ? (
              <Typography>{failedToLoad}</Typography>
            ) : (
              <>
                <div>
                  <MapList questionnaireHash={questionnaireHash} />
                  <MapAdd questionnaireHash={questionnaireHash} />
                </div>
              </>
            )}
          </>
        )}
      </>
    );
  }
}

export default MapDashboard;
