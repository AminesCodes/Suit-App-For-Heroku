import React, { PureComponent } from 'react';
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


export default class Routing extends PureComponent {
  // ################ RENDER ###########
  render() {
    return (
        <div className="maingrid bs container-fluid">

            <div className="j-topbar row">
                <div className="col">
                    <TopBar username={this.props.username} />
                </div>
            </div>

            <div className="j-stage row">
                <div className="j-sidebar-container j-col-2 col-2">
                    <SideBar username={this.props.username} logout={this.props.logout} />
                </div>
                <div className="j-main col">
                    <Switch>
                        <Route exact path={'/'}>
                            <Redirect to={`/${this.props.username}/feed`} /> 
                        </Route>
                        <Route path={'/undefined/:page'} component={ErrorNotFound} />
                        <Route path={'/:username/feed'} render={props => (<Feed username={this.props.username} userId={this.props.userId} {...props} /> )} />
                        <Route path={'/:username/persona'} render={props => (<Persona username={this.props.username} userId={this.props.userId} {...props} /> )} />
                        <Route path={'/:username/events'} render={props => (<Events username={this.props.username} userId={this.props.userId} {...props} /> )} />
                        <Route path={'/about'} render={props => (<AboutSA username={this.props.username} userId={this.props.userId} {...props} /> )} />
                        <Route path={'/:username/account'} render={props => (<Account username={this.props.username} userId={this.props.userId} logout={this.props.logout} {...props} /> )} />
                        <Route exact component={ErrorNotFound} />
                    </Switch>
                </div>
            </div>
        </div>
    )
  }
}