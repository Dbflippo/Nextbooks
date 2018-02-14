'use strict';


import React, { Component }     from 'react';
import { withRouter }           from 'react-router-dom';

/*************************************************************************/

export class Logout extends Component {
    componentWillMount() {
        $.ajax({
            url: '/v1/session',
            method: 'delete'
        }).then(() => {
            this.props.user.logOut(this.props.history);
        })
    }

    render() {
        return <div/>;
    }
}

export default withRouter(Logout);
