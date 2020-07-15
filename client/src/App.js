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
import { withRouter } from 'react-router-dom'

import LoginSigninForm from './components/LoginSigninForm';
import Routing from './components/Routing';
import AboutSA from './components/AboutSA';

import { ReactComponent as Logo } from './assets/images/logo_200112.svg';

toast.configure();

// const imgLogo = require('./assets/images/logo.png');


class App extends Component {
  state = {
    loggedUser: null,
    // loggedUserId: 0,
    // loggedUserUsername: '',
  }

  async componentDidMount() {
    try {
      const { data } = await axios.get('/&api&/users/isUserLoggedIn')
      this.setState({ loggedUser: data.payload })
      // console.log('Logged user in backend: ', data.payload)
      
    } catch (err) {
      console.log('ERROR', err)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.loggedUser !== this.state.loggedUser
  }

  handleFormSubmit = (user) => {
    this.setState({ loggedUser: user });
  }

  handleLogOut = async() => {
    try {
      await axios.get('/&api&/users/logout');
      sessionStorage.clear();
      this.setState({ loggedUser: null });
      this.props.history.push({ pathname: `/` })
    } catch (err) {
      console.log('ERROR', err)
    }
  }


  // ###################### RENDER ######################
  render() {
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

    if (this.state.loggedUser) {
      pageContent = <Routing 
                        user={this.state.loggedUser} 
                        logout={this.handleLogOut}
                        updateUser={this.handleFormSubmit}
                      />
    }

    return (
      <div className="App">
        {pageContent}
      </div>
    );
  }
}

export default withRouter(App)