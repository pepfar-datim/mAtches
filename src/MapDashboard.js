import React, { Component } from 'react';
import HeaderBar from "./HeaderBar.js";
import MapList from "./MapList.js";
import MapAdd from "./MapAdd.js";

import api from "./services/api.js";

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
    api.get('api/questionnaires')
    .then(questionnaires => {
      var questionnaireHash = questionnaires.reduce(function(mappedQs, q) {
        if (!mappedQs.hasOwnProperty(q.resource.url)){
          mappedQs[q.resource.url] = q.resource.name;
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
