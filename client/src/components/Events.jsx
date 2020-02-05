/*
Events Component | Client | SUITAPP Web App
GROUP 1: Amine Bensalem, Douglas MacKrell, Savita Madray, Joseph P. Pasaoa
*/


import React, { PureComponent } from 'react';
import axios from 'axios'
// import { Link } from 'react-router-dom';

import './Events.css';

export default class Events extends PureComponent {
  pw = sessionStorage.getItem('Suit_App_KS');
  uId = sessionStorage.getItem('Suit_App_UId');
  state = {
    events: []
  }

  async componentDidMount() {
    const response = await axios.get('/&api&/events/');
    const eventsArray = response.data.payload;
    this.setState({
      events: eventsArray
    })
  }

  // ################ RENDER ###########
  render() {
    const list = this.state.events.map((event, k) => {
      return (
        <div className="Event-list-item" key={k}>
          <div className="Event-name">
            {event.con_name}
          </div>
          <div className="Event-date">
            {(new Date(event.start_time).toLocaleString()).split(', ')[0]}
          </div>
          <div className="Event-date">
            {(new Date(event.end_time).toLocaleString()).split(', ')[0]}
          </div>
          <div className="Event-minor">
            {event.con_state}
          </div>
          <div className="Event-minor">
            {event.con_location}
          </div>
          <a
            className="Event-minor"
            href={event.con_url}
          >{event.con_url}</a>
        </div>
      )
    })
    return (
      <div className="Event-container">
      { list }
      </div>
    );
  }
}
