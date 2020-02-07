/*
CSS Reset | Client | SUITAPP Web App
GROUP 1: Amine Bensalem, Douglas MacKrell, Savita Madray, Joseph P. Pasaoa
*/


import React, { PureComponent } from 'react';
import { withRouter, Link, Switch, Route } from 'react-router-dom';

import './TopBar.css';

import UsernameSign from './UsernameSign';

// import { ReactComponent as Logo } from '../assets/images/logo_200112.svg';
const imgLogo1 = require('../assets/images/suitApp-Logo-Superhero.png');
const imgLogo2 = require('../assets/images/suitApp-Logo-Space.png');
const imgLogo3 = require('../assets/images/suitApp-Logo-Princess.png');
const imgLogo4 = require('../assets/images/suitApp-Logo-Explorer.png');

class TopBar extends PureComponent {
  state = {
    search: ''
  }

  handleSearchForm = async (event) => {
    event.preventDefault();
    this.props.history.push({
        pathname: `/${this.props.username}/feed/all`,
        search: `?search=${this.state.search}`
    });
  }

  handleSearchInput = event => {
    this.setState({search: event.target.value})
  }


  // ################ RENDER ###########
  render() {
    return (
      <nav className='j-navbar navbar navbar-expand-md'>
      
          <UsernameSign username={this.props.username} />

          <Link className='navbar-brand' to='/'>
            <Switch>
              <Route path={'/*/persona'}>
                <img className='j-logo' src={imgLogo2} alt="SuitApp Logo" />
              </Route>
              <Route path={'/*/events'}>
                <img className='j-logo' src={imgLogo3} alt="SuitApp Logo" />
              </Route>
              <Route path={'/*/account'}>
                <img className='j-logo' src={imgLogo4} alt="SuitApp Logo" />
              </Route>
              <Route path={'/'}>
                <img className='j-logo' src={imgLogo1} alt="SuitApp Logo" />
              </Route>
            </Switch>
          </Link>

          <form onSubmit={this.handleSearchForm}>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">#</span>
              </div>
              <input type="search" value={this.state.search} onChange={this.handleSearchInput} className="form-control" placeholder="search hashtags" aria-label="hashtags" aria-describedby="basic-addon1" />
            </div>
          </form>

          <button className='navbar-toggler navbar-dark' type='button' data-toggle='collapse' data-target='#collapsibleNavbar'>
              <span className='navbar-toggler-icon'></span>
          </button>

      </nav>
    )
  }
}

export default withRouter(TopBar);
