import React, { Component } from 'react';

class MapDashboard extends Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.state = {
      maps: []
    }
  }

  // Fetch the list on first mount
  componentDidMount() {
    this.getMaps();
  }

  // Retrieves the list of items from the Express app
  getMaps() {
    fetch('/api/maps')
    .then(res => res.json())
    .then(maps => {
      this.setState({"maps": maps })

    })  
  }

  render() {
    const { maps } = this.state;

    return (
      <div>
        <h1>List of Maps</h1>
        {/* Check to see if any items are found*/}
        {maps.length ? (
          <div>
            <p>{JSON.stringify(this.state.maps)}</p>
          </div>
        ) : (
          <div>
            <h2>No Maps Found</h2>
          </div>
        )
      }
      </div>
    );
  }
}

export default MapDashboard;