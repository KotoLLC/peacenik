import React from "react";
import "./App.css";

import { BrowserRouter as Router } from "react-router-dom";
import configureRoutes, { history } from "./configureRoutes";

const routes = configureRoutes();

function App() {
  return (
    <div className="App">
      <Router history={history}>{routes}</Router>
    </div>
  );
}

export default App;
