'use strict';


import React, { Component }     from 'react';
import { withRouter }  from 'react-router-dom';

/*************************************************************************/

class CTABox extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const user = this.props.user.getUser();
        const ctaBox = user.username !== '' ?
            <div className="row">
                <div className="cta-container">
                    <a href='/browse' className="cta">Find Books</a>
                    <a href='/add-books' className="cta">Add Books to Sell</a>
                    <a href={'/profile/'+user.username} className="cta">View Your Books</a>
                </div>
            </div>:
            <div>
                <div className="cta-container">
                    <a href='/browse' className="cta">Find Books</a>
                    <a href='/register' className="cta">Register as User</a>
                </div>
            </div>;
        return <div>
            {ctaBox}
        </div>
    };
}

export default withRouter(CTABox);