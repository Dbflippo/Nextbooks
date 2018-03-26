'use strict';

import React, { Component }             from 'react';
import { Link, withRouter }             from 'react-router-dom';

const Book = ({book, index}) => {
    return <div className="book-tile">
        <img className='book-cover' src='/images/book_placeholder.png'></img>
        <div className="book-tile-text">
            <div className="book-tile-title">{book.title}</div>
            <div>{book.author}</div>
            <div>{book.edition}</div>
            <div>ISBN: {book.ISBN}</div>
        </div>
        <div>
            <button className="btn btn-default book-btn">See Buying Options</button>
            <button className="btn btn-default book-btn" onClick={}>Add to Your List</button>
        </div>
    </div>
};

class Browse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                wanted_books: [],
                owned_books: [],
            },
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
/*
    fetchBookInfo() {
        $.ajax({
            url: '/v1/infobooks',
            method: 'get'
        })
            .then(data => {
                this.setState({ all_books: data });
            })
            .fail(err => {
                let errorEl = document.getElementById('errorMsg');
                errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
            });
    }
*/

    componentDidMount() {
        this.fetchUserInfo(this.props.user.getUser().username);
        //this.fetchBookInfo();
    }

    componentWillReceiveProps(nextProps) {
        this.fetchUserInfo(nextProps.user.getUser().username);
        //this.fetchBookInfo();
    }

    render() {
        const isEmptyWantList = this.state.user.wanted_books.length == 0;
        let wantList = this.state.user.wanted_books.map((book, index) => (
            <Book key={index} book={book} index={index}/>
        ));
        let ownedList = this.state.user.owned_books.map((book, index) => (
            <Book key={index} book={book} index={index}/>
        ));
        {/*
        let allBooksList = this.state.all_books.map((book, index) => (
            <Book key={index} book={book} index={index}/>
        ));
        */}
        return<div>
            <div className='browse'>
                <h3>On Your List:</h3>
                <div className='browse-window'>
                    {!isEmptyWantList ?
                        wantList :
                        <h4>No books found on Want list</h4>
                    }
                    </div>

                <h3>All Books:</h3>
                <div className='browse-window'>{ownedList}</div>
            </div>
        </div>
    }

}

export default withRouter(Browse);