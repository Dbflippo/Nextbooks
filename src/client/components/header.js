'use strict';


import React, { Component }     from 'react';
import { Link, withRouter }  from 'react-router-dom';

import md5                      from 'md5';

/*************************************************************************/

export function GravHash(email, size) {
    let hash = email.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    hash = hash.toLowerCase();
    hash = md5(hash);
    return `https://www.gravatar.com/avatar/${hash}?size=${size}`;
}

class Header extends Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        const { username } = this.props.user.getUser();
        this.props.history.push(`/profile/${username}`);
    }

    render() {
        const user = this.props.user.getUser();
        console.log("User");
        console.log(user);
        const header = user.username !== '' ?
            <div>
                <div className="col-xs-8">
                    <h2>Welcome to Nextbooks, {user.first_name}!</h2>
                </div>
                <div className="header">
                    <Link to="/logout">Log Out</Link>
                    <img src='/images/placeholder.png'/>
                </div>
            </div>:
            <div>
                <div className="col-xs-8">
                    <h2>Welcome to Nextbooks!</h2>
                </div>
                <div className="col-xs-4 right-nav">
                    <Link to="/login">Log In</Link>
                    <Link to="/register">Register</Link>
                </div>
            </div>;
        return <nav className="navbar navbar-default navbar-static-top">
            {header}
        </nav>
    }
}

export default withRouter(Header);