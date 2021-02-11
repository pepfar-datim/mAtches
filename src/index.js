import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Main from "./components/Main";

const Index = () => (
  <BrowserRouter>
    <Main />
  </BrowserRouter>
);
ReactDOM.render(<Index />, document.getElementById("root"));
