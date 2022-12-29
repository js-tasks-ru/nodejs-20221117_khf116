import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Registration from './Registration';
import Confirmation from './Confirmation';

export default class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Registration} />
          <Route path="/confirm/:token" component={Confirmation}  />
        </Switch>
      </Router>
    );
  }
}
