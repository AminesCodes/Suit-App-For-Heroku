/*
SideBar Component | Client | SUITAPP Web App
GROUP 1: Amine Bensalem, Douglas MacKrell, Savita Madray, Joseph P. Pasaoa
*/


import React from 'react';
import { NavLink, Link, Route } from 'react-router-dom';

import './SideBar.css';


export default function SideBar(props) {
  const username = props.username
  return (
    <ul className='j-sidebar nav flex-column'>
        <li className='nav-item'>
            <NavLink className='nav-link' to={`/${username}/feed`}>Home</NavLink>
            <Route path={'/*/feed'}>
              <ul>
                <li>
                  <NavLink className='j-sub-nav' exact to={`/${username}/feed`}>Your Feed</NavLink>
                </li>
                <li>
                  <NavLink className='j-sub-nav' to={`/${username}/feed/all`}>Explore</NavLink>
                </li>
              </ul>
            </Route> 
        </li>
        <li className='nav-item'>
            <NavLink className='nav-link' to={`/${username}/persona`}>Persona</NavLink>
            <Route path={'/*/persona'}>
              <ul>
                <li>
                  <NavLink className='j-sub-nav' exact to={`/${username}/persona`}>Appreciator</NavLink>
                </li>
                <li>
                  <NavLink className='j-sub-nav' to={`/${username}/persona/cosplayer`}>Cosplayer</NavLink>
                </li>
                <li>
                  <NavLink className='j-sub-nav' to={`/${username}/persona/designer`}>Designer</NavLink>
                </li>
              </ul>
            </Route> 
        </li>
        <li className='nav-item'>
            <NavLink className='nav-link' to={`/${username}/events`}>Events</NavLink>
            <Route path={'/*/events'}>
              <ul>
                <li>
                  <NavLink className='j-sub-nav' exact to={`/${username}/events`}>Events Hub</NavLink>
                </li>
              </ul>
            </Route> 
        </li>
        <li className='nav-item'>
            <NavLink className='nav-link' to={`/${username}/account`}>Account</NavLink>
            <Route path={'/*/account'}>
              <ul>
                <li>
                  <NavLink className='j-sub-nav' exact to={`/${username}/account`}>Edit My Account</NavLink>
                </li>
              </ul>
            </Route> 
        </li>
        <li className='nav-item'>
            <Link className='j-logout nav-link' to='/' onClick={props.logout}>Logout</Link>
        </li>
        <div className='j-sidenav-divider'></div>
        <li className='nav-item'>
            <NavLink className='nav-link' to={`/about`}>About</NavLink>
            <Route path={'/about'}>
              <ul>
                <li>
                  <NavLink className='j-sub-nav' exact to={`/about`}>SuitApp</NavLink>
                </li>
              </ul>
            </Route> 
        </li>
    </ul>
  );
}