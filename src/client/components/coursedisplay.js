'use strict';

import React, { Component }             from 'react';
import { Link, withRouter }             from 'react-router-dom';

class CourseDisplay extends Component {
    constructor(props) {
        super(props);
        this.state= {
            course: {
                school: '',
                department: '',
                number: '',
                name: '',
                professor: ''
            }
        };
    }

    fetchCourseInfo(school, department, number) {
        $.ajax({
            url: `/v1/course/${school}/${department}/${number}`,
            method: "get"
        })
            .then(data => {
                this.setState({ course: data });
            })
            .fail(err => {
                let errorEl = document.getElementById('errorMsg');
                errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
            });
    }

    componentDidMount() {
        this.fetchCourseInfo(
            this.props.match.params.school,
            this.props.match.params.department,
            this.props.match.params.number
        );
    }

    render() {
        return<div>
            <div className='col-xs-2'></div>
            <div className='col-xs-8'>
                <div className='col-xs-3 text-right'>
                    <h4>School:</h4>
                    <h4>Department:</h4>
                    <h4>Number:</h4>
                    <h4>Name:</h4>
                    <h4>Professor:</h4>
                </div>
                <div className='col-xs-9'>
                    <h4>{this.state.course.school}</h4>
                    <h4>{this.state.course.department}</h4>
                    <h4>{this.state.course.number}</h4>
                    <h4>{this.state.course.name}</h4>
                    <h4>{this.state.course.professor}</h4>
                </div>
            </div>
            <div className='col-xs-2'></div>
        </div>;
    }
}

export default withRouter(CourseDisplay);