import React, { Component } from 'react';
import {CircularProgress, Typography} from "@material-ui/core";
import HeaderBar from "./HeaderBar.js";
import MapList from "./MapList.js";
import MapAdd from "./MapAdd.js";

import api from "./services/api.js";

import {stylesObj} from './styling/stylesObj.js'

class MapDashboard extends Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.state = {
      loading: true
    }
  }

  // Fetch the list on first mount
  componentDidMount() {
    this.getQuestionnaires();
  }

  getQuestionnaires() {

    api.get('api/questionnaires')
    .then(questionnaires => {
      var questionnaireHash = questionnaires.reduce(function(mappedQs, q) {
        if (!mappedQs.hasOwnProperty(q.resource.url)){
          mappedQs[q.resource.url] = q.resource.name;
          return mappedQs
        }
      },{})
      this.setState({"questionnaireHash": questionnaireHash, "loading": false})
    })
    .catch(e => {
      this.setState({"failedToLoad": 'Failed to load questionnaires from FHIR Server', "loading": false})
    })

  }

  render() {
    return (
      <>
      <HeaderBar />
      {this.state.loading ? <CircularProgress style={stylesObj.loaderStyling} /> :
        <>
          {this.state.failedToLoad ? <Typography>{this.state.failedToLoad}</Typography> : 
          <>
            <div>
              <MapList questionnaireHash={this.state.questionnaireHash}/>        
              <MapAdd questionnaireHash={this.state.questionnaireHash}/>
            </div>          
          </>
          }
        </>
      }
      </>
    )}
  }

export default MapDashboard;
