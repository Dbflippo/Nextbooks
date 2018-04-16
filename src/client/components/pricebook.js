'use strict';


import React, { Component } from 'react';
import { withRouter }           from 'react-router-dom';


class PriceBook extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.state= {
            book: {
                ISBN: '',
                title: '',
                author: '',
                edition: '',
            }
        }
    }

    fetchInfo(ISBN) {
        $.ajax({
            url: `/v1/infobook/${ISBN}`,
            method: "get"
        })
            .then(data => {
                this.setState({ book: data });
            })
            .fail(err => {
                let errorEl = document.getElementById('errorMsg');
                errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
            });
    }

    componentDidMount() {
        this.fetchInfo(this.props.match.params.ISBN);
    }

    componentWillReceiveProps(nextProps) {
        this.fetchInfo(nextProps.match.params.ISBN);
    }


    onSubmit(ev) {
        ev.preventDefault();
        const data = {
            ISBN: document.getElementById('ISBN').value,
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            edition: document.getElementById('edition').value,
            price: document.getElementById('price').value,
            seller: this.props.user.data.username,
            school: this.props.user.data.school,
            sellemail: this.props.user.data.primary_email,
        };
        let $error = $('#errorMsg');

        $.ajax({
            url: `/v1/forsalebook`,
            method: 'post',
            data: data,
        })
            .then(()=> {
                this.props.history.push(`/profile/${this.props.user.data.username}`)
            })
            .fail(err => {
                $error.innerHTML = `Error: ${err.responseJson.error}`;
            });

    }

    render() {
        return <div className='row'>
            <div className='col-xs-1'></div>
            <div className='col-xs-6'>
                <div className="center-block">
                    <p id="errorMsg" className="bg-danger"/>
                </div>
                <h4>Register a New Book for Sale:</h4>
                <form className='form-horizontal'>
                    <div className='form-group'>
                        <label className='col-xs-2 control-label'>ISBN</label>
                        <div className='col-xs-10'>
                            <input className='form-control' id='ISBN' type='text' placeholder='ISBN' value={this.state.book.ISBN} readOnly="readOnly"/>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className='col-xs-2 control-label'>Title</label>
                        <div className='col-xs-10'>
                            <input className='form-control' id='title' type='text' placeholder='Title' value={this.state.book.title} readOnly="readOnly"/>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className='col-xs-2 control-label'>Author</label>
                        <div className='col-xs-10'>
                            <input className='form-control' id='author' type='text' placeholder='Author' value={this.state.book.author} readOnly="readOnly"/>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className='col-xs-2 control-label'>Edition</label>
                        <div className='col-xs-10'>
                            <input className='form-control' id='edition' type='text' placeholder='Edition' value={this.state.book.edition} readOnly="readOnly"/>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className='col-xs-2 control-label'>Your Price</label>
                        <div className='col-xs-10'>
                            <input className='form-control' id='price' type='number' placeholder='Your Price'/>
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

export default withRouter(PriceBook);