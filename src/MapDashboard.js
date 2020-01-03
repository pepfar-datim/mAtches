import React, { Component } from 'react';
import HeaderBar from "./HeaderBar.js";
import MapList from "./MapList.js";
import MapAdd from "./MapAdd.js";

import config from '../config.json'

class MapDashboard extends Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.state = {
    }
  }

  // Fetch the list on first mount
  componentDidMount() {
    this.getQuestionnaires();
  }

  getQuestionnaires() {
    fetch(config.base + 'api/questionnaires')
    .then(res => res.json())
    .then(questionnaires => {
      var questionnaireHash = questionnaires.reduce(function(mappedQs, q) {
        if (!mappedQs.hasOwnProperty(q.uid)){
          mappedQs[q.uid] = q.name;
          return mappedQs
        }
      },{})
      this.setState({"questionnaireHash": questionnaireHash })
    })  
  }

  render() {
    return (
      <div>
        <HeaderBar />
        {this.state.questionnaireHash &&
          <div>  
            <MapList questionnaireHash={this.state.questionnaireHash}/>        
            <MapAdd questionnaireHash={this.state.questionnaireHash}/>
          </div>
        }
      </div>
    );
  }
}

export default MapDashboard;
