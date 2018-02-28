'use strict';

import React, { Component }             from 'react';
import { Link, withRouter }             from 'react-router-dom';

const Book = ({book, index}) => {
    // fill in
};

class Browse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                primary_email: "",
                wanted_books: [],
                owned_books: [],
            },
            books: []
        }
    }

    fetchUserInfo(username) {
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

    fetchBookInfo() {
        let infobooks;
        $.ajax({
            url: '/v1/infobooks',
            method: 'get'
        })
            .then(data => {
                infobooks = data;
            })
            .fail(err => {
                let errorEl = document.getElementById('errorMsg');
                errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
            });
        for (var book in infobooks) {
            $.ajax({
                url: `/v1/user/${book.ISBN}`,
                method: 'get'
            })
                .then(data => {
                    this.state.books.push(data);
                })
                .fail(err => {
                    let errorEl = document.getElementById('errorMsg');
                    errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
                });
        }
    }


    componentDidMount() {
        this.fetchUserInfo(this.props.match.params.username);
        this.fetchBookInfo();
    }

    componentWillReceiveProps(nextProps) {
        this.fetchUserInfo(nextProps.match.params.username);
        this.fetchBookInfo();
    }

    render() {
        let wantList = this.state.user.wanted_books.map((book, index) => (
            <Book key={index} book={book} index={index}/>
        ));
        let allBooksList = this.state.books.map((book, index) => (
            <Book key={index} book={book} index={index}/>
        ));
        return<div>
            <div className='browse'>
                <h3>On Your List:</h3>
                <div className='browse-window'>{wantList}</div>
                <h3>All Books:</h3>
                <div className='browse-window'>{allBooksList}</div>
            </div>
        </div>
    }

}

export default withRouter(Browse);