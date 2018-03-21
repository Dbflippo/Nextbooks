'use strict';

import React, { Component }             from 'react';
import { Link, withRouter }             from 'react-router-dom';

const HaveBook = ({book, index}) => {
    return <tr key={index}>
        <th>{book.ISBN}</th>
        <th>{book.title}</th>
        <th>{book.author}</th>
        <th>${book.price}</th>
    </tr>
};

const WantBook = ({book, index}) => {
    return <tr key={index}>
        <th>{book.ISBN}</th>
        <th>{book.title}</th>
        <th>{book.author}</th>
    </tr>
};

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state= {
            user: {
                wanted_books: [],
                owned_books: [],
            }
        };
        this.sellBook = this.sellBook.bind(this);
    }

    fetchInfo(username) {
        $.ajax({
            url: `/v1/user/${username}`,
            method: "get"
        })
            .then(data => {
                this.setState({ user: data });
            })
            .fail(err => {
                let errorEl = document.getElementById('errorMsg');
                errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
            });
    }

    componentDidMount() {
        this.fetchInfo(this.props.match.params.username);
    }

    componentWillReceiveProps(nextProps) {
        this.fetchInfo(nextProps.match.params.username);
    }

    sellBook() {
        this.props.history.push('/checkbook')
    }

    render() {
        const isUser = this.props.match.params.username === this.props.user.getUser().username;
        let wantList = this.state.user.wanted_books.map((book, index) => (
            <WantBook key={index} book={book} index={index}/>
        ));
        let haveList = this.state.user.owned_books.map((book, index) => (
            <HaveBook key={index} book={book} index={index}/>
        ));
        return<div>
            <div className="center-block">
                <p id="errorMsg" className="bg-danger"/>
            </div>
            <div className='col-xs-2'></div>
            <div className='col-xs-10'>
                <h3>{this.props.match.params.username}</h3>
            </div>
            <div className='col-xs-2'></div>
            <div className='col-xs-2'>
                <img src='/images/placeholder.png' id="profile-image"/>
            </div>
            <div className='col-xs-8'>
                <div className='col-xs-3 text-right'>
                    <h4>Name:</h4>
                    <h4>School:</h4>
                    <h4>Email:</h4>
                </div>
                <div className='col-xs-9'>
                    <h4>{this.state.user.first_name} {this.state.user.last_name}</h4>
                    <h4>{this.state.user.school}</h4>
                    <h4>{this.state.user.primary_email}</h4>
                </div>
            </div>
            <div className='row col-xs-12'>
                <hr className='profile-hr'/>
            </div>
            <div className='col-xs-12'>
                <div className='col-xs-6'>
                    <h4 >Books For Sale</h4>
                    { isUser ? <button className='btn btn-default' onClick={this.sellBook}>Sell A Book</button> : undefined }
                </div>
                <h4 className='col-xs-6'>Books You Want</h4>
            </div>
            <div className='col-xs-12'>
                <div className='col-xs-6'>
                    <table id='have-list' className='table'>
                        <thead>
                        <tr>
                            <th>ISBN</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Price</th>
                        </tr>
                        </thead>
                        <tbody>{haveList}</tbody>
                    </table>
                </div>
                <div className='col-xs-6'>
                    <table id='want-list' className='table'>
                        <thead>
                        <tr>
                            <th>ISBN</th>
                            <th>Title</th>
                            <th>Author</th>
                        </tr>
                        </thead>
                        <tbody>{wantList}</tbody>
                    </table>
                </div>
            </div>
        </div>;
    }
}

export default withRouter(Profile);