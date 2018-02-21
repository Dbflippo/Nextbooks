'use strict';

import React, { Component }             from 'react';
import { Link, withRouter }             from 'react-router-dom';

//Todo: split this into have/want books because the links when you click on them will lead different places
const Book = ({book, index}) => {
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
                primary_email: ""
            }
        }
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

    render() {
        const isUser = this.props.match.params.username === this.props.user.getUser().username;
        let wantList = this.state.user.wanted_books.map((book, index) => (
            <Book key={index} book={book} index={index}/>
        ));
        let haveList = this.state.user.owned_books.map((book, index) => (
            <Book key={index} book={book} index={index}/>
        ));
        return<div>
            <div className='col-xs-12'>
                <h4>{this.props.match.params.username}</h4>
            </div>
            <div className='col-xs-3'>
                <img src='/images/placeholder.png' id="profile-image"/>
            </div>
            <div className='col-xs-9'>
                <div className='col-xs-3 text-right'>
                    <p>Name:</p>
                    <p>School:</p>
                    <p>Email:</p>
                </div>
                <div className='col-xs-9'>
                    <p>{this.state.user.first_name} {this.state.user.last_name}</p>
                    <p>{this.state.user.school}</p>
                    <p>{this.state.user.primary_email}</p>
                </div>
            </div>
            <div className='row col-xs-12'>
                <hr className='profile-hr'/>
            </div>
            <div className='col-xs-12'>
                <h4 className='col-xs-6'>Books For Sale</h4>
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