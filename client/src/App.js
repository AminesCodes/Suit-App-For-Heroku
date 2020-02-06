/*
Sitewide Styling | Client | SUITAPP Web App
GROUP 1: Amine Bensalem, Douglas MacKrell, Savita Madray, Joseph P. Pasaoa
*/


import React, { Component } from 'react';
import { toast } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';

import './reset.css'; // stays before App.css
import './App.css'; // this must stay before component imports
import axios from 'axios'

import LoginSigninForm from './components/LoginSigninForm';
import Routing from './components/Routing';
import AboutSA from './components/AboutSA';

import { ReactComponent as Logo } from './assets/images/logo_200112.svg';

toast.configure();

// const imgLogo = require('./assets/images/logo.png');


export default class App extends Component {
  state = {
    loggedUser: null,
    loadingData: false,
    // loggedUserId: 0,
    // loggedUserUsername: '',
  }

  async componentDidMount() {
    console.log('COMPONENT DIT MOUNT')
    try {
      this.setState({ loadingData: true })
      const { data } = await axios.get('/&api&/users/isUserLoggedIn')
      console.log('COMPONENT DIT MOUNT', data.payload)
      this.setState({
        loggedUser: data.payload,
        loadingData: false
      })
    } catch (err) {
      this.setState({ loadingData: false })
      console.log('ERROR', err)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.loggedUser !== this.state.loggedUser
  }

  handleFormSubmit = (user, password) => {
    sessionStorage.setItem('Suit_App_KS', password);
    sessionStorage.setItem('Suit_App_UId', user.id);
    sessionStorage.setItem('Suit_App_Un', user.username);
    
    this.setState({ loggedUser: user });
  }

  handleLogOut = async() => {
    try {
      await axios.get('/&api&/users/logout');
      sessionStorage.clear();
      this.setState({ loggedUser: null });
    } catch (err) {
      console.log('ERROR', err)
    }
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
