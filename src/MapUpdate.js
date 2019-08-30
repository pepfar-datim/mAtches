import React, { Component } from 'react';
import queryString from 'query-string'
import  { Redirect } from 'react-router-dom'
import HeaderBar from "./HeaderBar.js";
import MapEdit from './MapEdit.js';
import MapUpload from './MapUpload.js';

import config from '../config.json'

class MapUpdate extends Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.state = {
      //queryString delivers object for which hasOwnProperty is removed, so make copy for hack...
      queryParams: JSON.parse(JSON.stringify(queryString.parse(this.props.location.search))), 
      mapID: props.match.params.id,
      map: {},
      questionnaireUID: '',
      questionnaire: {},
      mode: '',
    }
  }

 // Fetch the list on first mount
  componentDidMount() {
    this.getSpecificMap(this.state.mapID);
    var mode = 'invalid';
    if(this.state.queryParams.hasOwnProperty('mode')){
      if(this.state.queryParams['mode'].toLowerCase() == 'upload'){mode = 'upload'}
      if(this.state.queryParams['mode'].toLowerCase() == 'edit'){mode = 'edit'}
    }
    this.setState({'mode': mode});
  }

  // Retrieves the list of items from the Express app
  getSpecificMap(id) {
    fetch(config.base + 'api/maps/' + id)
    .then(res => res.json())
    .then(map => {
      this.setState({"map": map })
      var questionnaireUID = map.questionnaireuid;
      this.setState({"questionnaireUID":questionnaireUID});  
      return questionnaireUID
    })
    .then(questionnaireUID =>{
      this.getSpecificQuestionnaire(questionnaireUID)
    })  
  }
  
  getSpecificQuestionnaire(id) {
    fetch(config.base +'api/questionnaires/' + id)
    .then(res => res.json())
    .then(questionnaire => {
      this.setState({"questionnaire": questionnaire})
    })
  }
  
  render() {
    if(this.state.mode==='invalid'){
        //adding Header/MapEdit components is a hack...because redirect fails to rerender components...(not ideal approach)
        return(
          <div>        
            <Redirect to={config.base + 'maps/' + this.state.mapID + '?mode=edit'} />
            <HeaderBar />
            <MapEdit id={this.state.mapID} map={this.state.map} questionnaire={this.state.questionnaire}/>
          </div>
        )
    }
    else{
      return (
        <div>
          
          {this.state.mode=='edit' && (
            <div>
              <HeaderBar />
              <MapEdit id={this.state.mapID} map={this.state.map} questionnaire={this.state.questionnaire}/>
            </div>
          )}
          {this.state.mode=='upload' && (
            <div>
              <HeaderBar />
              <MapUpload id={this.state.mapID} map={this.state.map} questionnaire={this.state.questionnaire}/>
            </div>
          )}      
        </div>
      );
    }
  }
}

export default MapUpdate;