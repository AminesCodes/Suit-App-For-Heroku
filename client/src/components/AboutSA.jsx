/*
AboutSA Component | Client | SUITAPP Web App
GROUP 1: Amine Bensalem, Douglas MacKrell, Savita Madray, Joseph P. Pasaoa
*/


import React, { PureComponent } from 'react';
// import { Link } from 'react-router-dom';

import './AboutSA.css';

export default class AboutSA extends PureComponent {
  pw = sessionStorage.getItem('Suit_App_KS');
  uId = sessionStorage.getItem('Suit_App_UId');
  state = {
    logo: 0
  }

  randomLogoLink() {
    let url = '../assets/images/suitApp-Logo-Explorer.png';
    let random = Math.floor(Math.random() * 4);
    if (random === 0) {
      url = require('../assets/images/suitApp-Logo-Superhero.png')
    } else if (random === 1) {
      url = require('../assets/images/suitApp-Logo-Princess.png')
    } else if (random === 2) {
      url = require('../assets/images/suitApp-Logo-Space.png')
    } else {
      url = require('../assets/images/suitApp-Logo-Explorer.png')
    }
    return url
  }

  // ################ RENDER ###########
  render() {
    return (
      <>
        <div className="About">
          <div className="about-text"><strong>SuitApp</strong> is a social media site founded on the idea of bringing together the most passionate and creative minds in the world of Cosplay and giving them the tools to reach a wide audience of fans who appreciate and celebrate their work. We want to help you forge the connections to grow your skills and collaborate on bigger builds and bolder designs.<br/>
            <br/>
            Find your following.<br/>
            Empower your Cosplay.<br/>
            Discover your best self.<br/>
            <br/>
            It’s time to<br/>
            <img 
              alt="suitApp logo" 
              src={this.randomLogoLink()}
              className="hero-logo"
            />
          </div>
        </div>
      </>
    );
  }
}
