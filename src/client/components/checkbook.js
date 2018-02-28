'use strict';


import React, { Component } from 'react';
import { withRouter }           from 'react-router-dom';


class CheckBook extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    static validISBN(ISBN) {
        if(!ISBN || ISBN.length !== 13) {
            return {error: 'ISBN must be 13 digits long'}
        }
        else if (!ISBN.match(/^[0-9]*$/)) {
            return {error: 'ISBN can only include digits 0-9'}
        }
    }

    onSubmit(ev) {
        ev.preventDefault();
        const data = {
            ISBN: document.getElementById('ISBN').value
        };
        let $error = $('#errorMsg');
        let ISBNinvalid = CheckBook.validISBN(data.ISBN);
        if(ISBNinvalid) {
            $error.html(`Error: ${ISBNinvalid.error}`);
        } else $.ajax({
            url: `/v1/infobook/${data.ISBN}`,
            method: 'head',
            data: data,
        })
            .then(() => {
                this.props.book.RegisterBook(this.props.history, data)
            })
            .fail(err => {
                if(err.status === 404) {
                    this.props.book.RegisterBook(this.props.history, data)
                } else {
                    let errorEl = document.getElementById('errorMsg');
                    errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
                }
            })

    }

    render() {
        return <div className='row'>
            <div className='col-xs-6'>
                <div className="center-block">
                    <p id="errorMsg" className="bg-danger"/>
                </div>
                <h4>Enter the ISBN of the book you wish to sell</h4>
                <h6>Please make sure the ISBN you enter is correct</h6>
                <form className='form-horizontal'>
                    <div className='form-group'>
                        <label className='col-xs-2 control-label'>ISBN</label>
                        <div className='col-xs-10'>
                            <input className='form-control' id='ISBN' type='text' placeholder='ISBN'/>
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

export default withRouter(CheckBook);