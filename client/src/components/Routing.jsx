import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import './Routing.css';

import TopBar from './TopBar';
import SideBar from './SideBar';
import Feed from './Feed';
import Persona from './Persona';
import Events from './Events';
import Account from './Account';
import AboutSA from './AboutSA';
import ErrorNotFound from './ErrorNotFound';


export default function Routing(props) {
    const user = props.user
  return (
      <div className="maingrid bs container-fluid">
          <div className="j-topbar row">
              <div className="col">
                  <TopBar username={user.username} />
              </div>
          </div>

          <div className="j-stage row">
              <div className="j-sidebar-container j-col-2 col-2">
                  <SideBar username={user.username} logout={props.logout} />
              </div>
              <div className="j-main col">
                  <Switch>
                      <Route exact path={'/'}>
                          <Redirect to={`/${user.username}/feed`} /> 
                      </Route>
                      <Route path={'/undefined/:page'} component={ErrorNotFound} />
                      <Route path={'/:username/feed'} render={routeProps => (<Feed 
                                user={user}
                                loggedUserId={user.id}
                                {...routeProps} /> )} 
                            />
                      <Route path={'/:username/persona'} render={routeProps => (<Persona 
                                user={user}
                                loggedUserId={user.id}
                                {...routeProps} /> )} 
                            />
                      <Route path={'/:username/events'} render={routeProps => (<Events 
                                user={user}
                                {...routeProps} /> )} 
                            />
                      <Route path={'/about'} render={routeProps => (<AboutSA 
                                user={user}
                                {...routeProps} /> )} 
                            />
                      <Route path={'/:username/account'} render={routeProps => (<Account 
                                user={user}
                                loggedUserId={user.id}
                                updateUser={props.updateUser}
                                logout={props.logout}
                                {...routeProps} /> )} 
                            />
                      <Route exact component={ErrorNotFound} />
                  </Switch>
              </div>
          </div>
      </div>
  )
}