/*
Sitewide Styling | Client | SUITAPP Web App
GROUP 1: Amine Bensalem, Douglas MacKrell, Savita Madray, Joseph P. Pasaoa
*/


import React, { Component } from 'react';
import { toast } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';

import './reset.css'; // stays before App.css
import './App.css'; // this must stay before component imports

import LoginSigninForm from './components/LoginSigninForm';
import Routing from './components/Routing';
import AboutSA from './components/AboutSA';

import { ReactComponent as Logo } from './assets/images/logo_200112.svg';

toast.configure();

// const imgLogo = require('./assets/images/logo.png');


export default class App extends Component {
  state = {
    loggedUser: null,
    // loggedUserId: 0,
    // loggedUserUsername: '',
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.loggedUser !== this.state.loggedUser
  }

  handleFormSubmit = (user, password) => {
    sessionStorage.setItem('Suit_App_KS', password);
    sessionStorage.setItem('Suit_App_UId', user.id);
    sessionStorage.setItem('Suit_App_Un', user.username);
    
    this.setState({
      loggedUser: user,
    });
  }

  handleLogOut = () => {
    sessionStorage.clear();
    this.setState({
      loggedUser: null,
    })
  }


  // ###################### RENDER ######################
  render() {
    const pw = sessionStorage.getItem('Suit_App_KS')
    const uId = sessionStorage.getItem('Suit_App_UId')
    const username = sessionStorage.getItem('Suit_App_Un')

    let pageContent = 
      <>
        <div className="j-jumbotron jumbotron bg-appColor text-white">
          <div className="container-sm mx-auto">
            <Logo className='img-fluid d-sm-block mx-auto' alt='SuitApp Logo' title="SuitApp Logo" />
          </div>
          <LoginSigninForm formSubmit={this.handleFormSubmit}/>
        </div>
        <div className="j-arrow-down">V</div>
        <AboutSA className='container-sm'/>
      </>

    if (pw && uId) {
      pageContent = <Routing user={this.state.loggedUser} userId={uId} username={username} logout={this.handleLogOut}/>
    }

    return (
      <div className="App">
        {pageContent}
      </div>
    );
  }
}
