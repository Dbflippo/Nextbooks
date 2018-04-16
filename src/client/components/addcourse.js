'use strict';


import React, { Component } from 'react';
import { withRouter }           from 'react-router-dom';

class AddCourse extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

}

export default withRouter(AddCourse);