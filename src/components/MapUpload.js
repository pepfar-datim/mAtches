import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Card,
  Typography,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import Edit from "@material-ui/icons/Edit";

import UploadCard from "./UploadCard";
import config from "../../config.json";

import loadMapQuestionnaire from "../services/loadMapQuestionnaire";

import { stylesObj } from "../styling/stylesObj";

function formatMapping(item) {
  if (item.header) {
    return item.header;
  }
  if (item.constant) {
    return item.constant.code;
  }
  return "";
}

function formatQuestions(mapCheck) {
  return Object.keys(mapCheck.flatQuestionnaire).map((k) => (
    <div key={`question-${k}`}>
      <Typography wrap="noWrap">
        <strong>{mapCheck.flatQuestionnaire[k].text}</strong>
      </Typography>
      <Typography wrap="noWrap">
        {formatMapping(mapCheck.flatQuestionnaire[k])}
      </Typography>
      <br />
    </div>
  ));
}

class MapUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: { name: "", uid: "" },
      questionnaire: { resource: { name: "" } },
      mapCheck: { flatQuestionnaire: {} },
      loading: true,
    };
  }

  componentDidMount() {
    const { id } = this.props;
    loadMapQuestionnaire(id, this);
  }

  render() {
    const { failedToLoad, loading, map, mapCheck, questionnaire } = this.state;
    return (
      <>
        {loading ? (
          <CircularProgress style={stylesObj.loaderStyling} />
        ) : (
          <>
            {failedToLoad ? (
              <>
                <Typography>{failedToLoad}</Typography>
              </>
            ) : (
              <>
                <div style={stylesObj.themePadding}>
                  <Grid
                    container
                    className={stylesObj.flexGrow}
                    wrap="nowrap"
                    spacing={2}
                  >
                    <Grid item xs={3} style={stylesObj.gridWidth}>
                      <Card style={stylesObj.sideCard} wrap="wrap">
                        <div style={stylesObj.themePadding}>
                          <Typography variant="h6">
                            <strong>Map name: </strong>
                            {map.name}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Questionnaire: </strong>
                            {questionnaire.resource.name}
                          </Typography>
                          <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={() => {
                              window.location = `${config.base}maps/${map.uid}?mode=edit`;
                            }}
                          >
                            <Edit />
                          </IconButton>
                          <br />
                          <br />
                          <br />
                          {mapCheck && <div>{formatQuestions(mapCheck)}</div>}
                        </div>
                      </Card>
                    </Grid>
                    <Grid item xs>
                      <UploadCard map={map} />
                    </Grid>
                  </Grid>
                </div>
              </>
            )}
          </>
        )}
      </>
    );
  }
}

MapUpload.propTypes = {
  id: PropTypes.string.isRequired,
};

export default MapUpload;
