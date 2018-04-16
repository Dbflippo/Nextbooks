'use strict';


import React, { Component } from 'react';
import { withRouter }           from 'react-router-dom';

class AddCourse extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(ev) {
        ev.preventDefault();
        const coursedata = {
            school: document.getElementById('school').value,
            department: document.getElementById('department').value,
            number: document.getElementById('number').value,
            name: document.getElementById('name').value,
            professor: document.getElementById('professor').value,
            //books: [document.getElementById('book').value],
        };
        let $error = document.getElementById('errorMsg');
        if(!coursedata.name) {
            $error.innerHTML = 'Error: Please enter a course name'
        } else {
            $.ajax({
                url: '/v1/course',
                method: 'post',
                data: coursedata,
            })
                .then(() => {
                    this.props.history.push(`/course/${coursedata.school}/${coursedata.department}/${coursedata.number}`)
                })
                .fail(err => {
                    $error.innerHTML = `Error: ${err.responseJson.error}`;
                })
        }


    }

    render() {
        return <div className='row'>
            <div className='col-xs-1'></div>
            <div className='col-xs-6'>
                <div className="center-block">
                    <p id="errorMsg" className="bg-danger"/>
                </div>
                <h4>Add a new course:</h4>
                <form className='form-horizontal'>
                    <div className='form-group'>
                        <label className='col-xs-2 control-label'>School</label>
                        <div className='col-xs-10'>
                            <input className='form-control' id='school' type='text' placeholder='School' value={this.props.match.params.school} readOnly="readOnly"/>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className='col-xs-2 control-label'>Department</label>
                        <div className='col-xs-10'>
                            <input className='form-control' id='department' type='text' placeholder='Department' value={this.props.match.params.department} readOnly="readOnly"/>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className='col-xs-2 control-label'>Course #</label>
                        <div className='col-xs-10'>
                            <input className='form-control' id='number' type='text' placeholder='i.e. 1101' value={this.props.match.params.number} readOnly="readOnly"/>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className='col-xs-2 control-label'>Course Name</label>
                        <div className='col-xs-10'>
                            <input className='form-control' id='name' type='text'/>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className='col-xs-2 control-label'>Professor</label>
                        <div className='col-xs-10'>
                            <input className='form-control' id='professor' type='text' placeholder='Last Name, First Name'/>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className='col-xs-2 control-label'>Book ISBN</label>
                        <div className='col-xs-10'>
                            <input className='form-control' id='book' type='text' placeholder='ISBN'/>
                        </div>
                    </div>
                    <div className='form-group'>
                        <div className='col-xs-offset-2 col-xs-10'>
                            <button className='btn btn-default' onClick={this.onSubmit}>Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>;
    }

}

export default withRouter(AddCourse);