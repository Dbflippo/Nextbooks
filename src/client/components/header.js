'use strict';


import React, { Component }     from 'react';
import { withRouter }  from 'react-router-dom';

/*************************************************************************/


class Header extends Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.onLogin = this.onLogin.bind(this);
        this.onRegister = this.onRegister.bind(this);
        this.onLogout = this.onLogout.bind(this);
    }

    onClick() {
        const { username } = this.props.user.getUser();
        this.props.history.push(`/profile/${username}`);
    }

    onLogin() {
        this.props.history.push(`/login`)
    }

    onRegister() {
        this.props.history.push(`/register`)
    }

    onLogout() {
        this.props.history.push(`/logout`)
    }

    render() {
        const user = this.props.user.getUser();
        const header = user.username !== '' ?
            <div>
                <div className="col-xs-8">
                    <h2>Welcome to Nextbooks, {user.first_name}!</h2>
                </div>
                <div className="header">
                    <button onClick={this.onLogout} className="btn btn-default">Log Out</button>
                    <img src='/images/placeholder.png' onClick={this.onClick}/>
                </div>
            </div>:
            <div>
                <div className="col-xs-8">
                    <h2>Welcome to Nextbooks!</h2>
                </div>
                <div className="col-xs-4 right-nav">
                    <button onClick={this.onLogin} className="btn btn-default" id="loginbtn">Login</button>
                    <button onClick={this.onRegister} className="btn btn-default">Register</button>
                </div>
            </div>;
        return <nav className="navbar navbar-default navbar-static-top">
            {header}
        </nav>
    }
}

export default withRouter(Header);