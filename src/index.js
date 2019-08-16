import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Main from './Main.js';
const Index = () => {
  return (
  	<BrowserRouter>
  		<Main />
  	</BrowserRouter>

  	);
};
ReactDOM.render(<Index />, document.getElementById('root'));
