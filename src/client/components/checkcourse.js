'use strict';


import React, { Component } from 'react';
import { withRouter }           from 'react-router-dom';

class CheckCourse extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(ev) {
        ev.preventDefault();
        const data = {
            school: document.getElementById('school').value,
            department: document.getElementById('department').value,
            number: document.getElementById('number').value
        };
        $.ajax({
            url: `/v1/course/${data.school}/${data.department}/${data.number}`,
            method: 'head',
            data: data,
        })
            .then(() => {
                this.props.book.UpdateCourse(this.props.history, data)
            })
            .fail(err => {
                if(err.status === 404) {
                    this.props.book.AddCourse(this.props.history, data)
                } else {
                    let errorEl = document.getElementById('errorMsg');
                    errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
                }
            })

    }

    render() {
            return <div className='row'>
                <div className='col-xs-1'></div>
                <div className='col-xs-6'>
                    <div className="center-block">
                        <p id="errorMsg" className="bg-danger"/>
                    </div>
                    <h4>Enter the Course Information of the course you wish to add</h4>
                    <form className='form-horizontal'>
                        <div className='form-group'>
                            <label className='col-xs-2 control-label'>School</label>
                            <div className='col-xs-10'>
                                <input className='form-control' id='school' type='text' placeholder='School' value={this.props.user.data.school} readOnly="readOnly"/>
                            </div>
                            <label className='col-xs-2 control-label'>Department</label>
                            <div className='col-xs-10'>
                                <select className="form-control" id="department">
                                    <option value="" disabled selected>Department</option>
                                    <option value="computer-science">Computer Science</option>
                                    <option value="engineering-management">Engineering Management</option>
                                    <option value="mathematics">Mathematics</option>
                                    <option value="philosophy">Philosophy</option>
                                </select>
                            </div>
                            <label className='col-xs-2 control-label'>Course Number</label>
                            <div className='col-xs-10'>
                                <input className='form-control' id='number' type='text' placeholder='i.e. 1101'/>
                            </div>
                        </div>
                        <div className='form-group'>
                            <div className='col-xs-offset-2 col-xs-10'>
                                <button className='btn btn-default' onClick={this.onSubmit}>Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        };

}

export default withRouter(CheckCourse);