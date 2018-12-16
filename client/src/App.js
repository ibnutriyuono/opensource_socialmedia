import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import jwt_decode from 'jwt-decode';
import store from './store/store';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from "./actions/authActions";

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

import './App.css';

// check token
if(localStorage.jwtToken){
  // set auth token
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch(setCurrentUser(decoded));
  // check expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    // TODO : Clear current user
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store = { store }>
        <Router>
          <div className="App">
            <Navbar/>
              <Route exact path = "/" component = {Landing}/>
              <div className="container">
                <Route exact path = "/register" component = {Register}/>
                <Route exact path = "/login" component = {Login} />
              </div> 
            <Footer/>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
