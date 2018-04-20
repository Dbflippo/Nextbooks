'use strict';

import React, { Component }             from 'react';
import { Link, withRouter }             from 'react-router-dom';

const AvailableBook = ({book, index, addWish, buyOptions}) => {
    return <div key={index} className="book-tile">
        <img className='book-cover' src='/images/book_placeholder.png'></img>
        <div className="book-tile-text">
            <div className="book-tile-title">{book.title}</div>
            <div>{book.author}</div>
            <div>{book.edition}</div>
            <div>ISBN: {book.ISBN}</div>
        </div>
        <div>
            <button className="btn btn-default book-btn" onClick={buyOptions}>See Buying Options</button>
            <button className="btn btn-default book-btn" onClick={addWish}>Add to Your Wish List</button>
        </div>
    </div>
};

const WantedBook = ({book, index, removeWish, buyOptions}) => {
    return <div key={index} className="book-tile">
        <img className='book-cover' src='/images/book_placeholder.png'></img>
        <div className="book-tile-text">
            <div className="book-tile-title">{book.title}</div>
            <div>{book.author}</div>
            <div>{book.edition}</div>
            <div>ISBN: {book.ISBN}</div>
        </div>
        <div>
            <button className="btn btn-default book-btn" onClick={buyOptions}>See Buying Options</button>
            <button className="btn btn-default book-btn" onClick={removeWish}>Remove From Wish List</button>

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
            all_books: [],
            filtered_wanted: [],
        };
        this.fetchUserInfo = this.fetchUserInfo.bind(this);
        this.fetchBookInfo = this.fetchBookInfo.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    fetchUserInfo(username) {
        $.ajax({
            url: `/v1/user/${username}`,
            method: "get"
        })
            .then(data => {
                this.setState({ user: data, filtered_wanted: data.wanted_books});
            })
            .fail(err => {
                let errorEl = document.getElementById('errorMsg');
                errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
            });
    }

    fetchBookInfo() {
        $.ajax({
            url: '/v1/infobooks',
            method: 'get',
            data: {filtered: false}
        })
            .then(data => {
                this.setState({ all_books: data.all_books });
            })
            .fail(err => {
                let errorEl = document.getElementById('errorMsg');
                errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
            });
    }

    addToWishList(id, ISBN) {
        $.ajax({
            url: '/v1/user',
            method: 'put',
            data: {id: id, wanted_books: this.state.filtered_wanted, ISBN: ISBN, addbook: true}
        })
            .then(data => {
                this.setState({ filtered_wanted: data})
            })
            .fail(err => {
                console.log(err)
            })
    }

    removeFromWishList(id, ISBN) {
        $.ajax({
            url: '/v1/user',
            method: 'put',
            data: {id: id, wanted_books: this.state.filtered_wanted, ISBN: ISBN, addbook: false}
        })
            .then(data => {
                this.setState({ filtered_wanted: data})
            })
            .fail(err => {
                console.log(err)
            })
    }

    viewBuyingOptions(ISBN) {
        this.props.history.push(`/BuyingOptions/${ISBN}`)
    }

    onSearch(ev) {
        ev.preventDefault();
        const data = {
            search: document.getElementById('search').value,
            category: document.getElementById('category').value,
            filtered: true,
            wanted_books: this.state.user.wanted_books,
        };
        $.ajax({
            url: '/v1/infobooks',
            method: 'get',
            data: data,
        }).then(data => {
            console.log(data);
            if(data.wanted_books === undefined) {
                data.wanted_books = [];
            }
            this.setState({ all_books: data.all_books, filtered_wanted: data.wanted_books})
        })
    }


    componentDidMount() {
        this.fetchUserInfo(this.props.user.getUser().username);
        this.fetchBookInfo();
    }

    componentWillReceiveProps(nextProps) {
        this.fetchUserInfo(nextProps.user.getUser().username);
        this.fetchBookInfo();
    }

    render() {
        console.log(this.state);
        const isEmptyWantList = this.state.filtered_wanted.length === 0;
        let wantList = this.state.filtered_wanted.map((book, index) => (
            <WantedBook key={index} book={book} index={index} removeWish={() => {this.removeFromWishList(book._id, book.ISBN)}} buyOptions={() => {this.viewBuyingOptions(book.ISBN)}}/>
        ));

        let allBooksList = this.state.all_books.map((book, index) => (
            <AvailableBook key={index} book={book} index={index} addWish={() => {this.addToWishList(book._id, book.ISBN)}} buyOptions={() => {this.viewBuyingOptions(book.ISBN)}}/>
        ));
        return<div>
            <div className='browse'>
                <div className="col-xs-12">
                    <form>
                        <div className='form-group col-xs-6'>
                            <input className='form-control' id='search' type='text' placeholder='Enter exact ISBN, Title, or Author...'/>
                        </div>
                        <div className='form-group col-xs-3'>
                            <select className='form-control' id='category' name='category'>
                                <option value='ISBN'>ISBN</option>
                                <option value='title'>Title</option>
                                <option value='author'>Author</option>
                            </select>
                        </div>
                        <div className='form-group col-xs-3'>
                            <button className='btn btn-default' onClick={this.onSearch}>Search</button>
                        </div>
                    </form>
                </div>
                <h3>On Your Wish List:</h3>
                <div className='browse-window'>
                    {!isEmptyWantList ?
                        wantList :
                        <h4>No books found on Want list</h4>
                    }
                    </div>

                <h3>All Books:</h3>
                <div className='browse-window'>{allBooksList}</div>
            </div>
        </div>
    }

}

export default withRouter(Browse);