'use strict';

import React, { Component }             from 'react';
import { Link, withRouter }             from 'react-router-dom';

const AvailableBook = ({book, index, onClick}) => {
    return <div key={index} className="book-tile">
        <img className='book-cover' src='/images/book_placeholder.png'></img>
        <div className="book-tile-text">
            <div className="book-tile-title">{book.title}</div>
            <div>{book.author}</div>
            <div>{book.edition}</div>
            <div>ISBN: {book.ISBN}</div>
        </div>
        <div>
            <button className="btn btn-default book-btn" onClick={onClick}>Add to Your Wish List</button>
        </div>
    </div>
};

class CourseDisplay extends Component {
    constructor(props) {
        super(props);
        this.state= {
            course: {
                school: '',
                department: '',
                number: '',
                name: '',
                professor: '',
                book: '',
            },
            book: {
                ISBN:            '',
                title:           '',
                author:          '',
                edition:         '',
                for_sale:        [],
            },
        };
        this.fetchCourseInfo = this.fetchCourseInfo.bind(this);
    }

    fetchCourseInfo(school, department, number) {
        $.ajax({
            url: `/v1/course/${school}/${department}/${number}`,
            method: "get"
        })
            .then(data1 => {
                this.setState({ course: data1 });
                $.ajax({
                    url: `/v1/infobook/${data1.book}`,
                    method: 'get'
                })
                    .then(data2 => {
                        this.setState({ book: data2 });
                    })
                    .fail(err => {
                        let errorEl = document.getElementById('errorMsg');
                        errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
                    });
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
            data: {id: id, wanted_books: this.state.user.wanted_books, ISBN: ISBN, addbook: true}
        })
            .then(data => {
                this.setState({ user: {wanted_books: data}})
            })
            .fail(err => {
                console.log(err)
            })
    }

    componentDidMount() {
        this.fetchCourseInfo(
            this.props.match.params.school,
            this.props.match.params.department,
            this.props.match.params.number
        );
    }


    render() {
        let classBook = <AvailableBook key='1' book={this.state.book} index='1' onClick={() => {this.addToWishList(book.id, book.ISBN)}}/>
        return<div>
            <div className='col-xs-2'></div>
            <div className='col-xs-8'>
                <div className='col-xs-3 text-right'>
                    <h4>School:</h4>
                    <h4>Department:</h4>
                    <h4>Number:</h4>
                    <h4>Name:</h4>
                    <h4>Professor:</h4>
                    <h4>Book: </h4>
                </div>
                <div className='col-xs-5'>
                    <h4>{this.state.course.school}</h4>
                    <h4>{this.state.course.department}</h4>
                    <h4>{this.state.course.number}</h4>
                    <h4>{this.state.course.name}</h4>
                    <h4>{this.state.course.professor}</h4>
                    <h4>{this.state.book.title}</h4>
                </div>
            </div>
            <div className='col-xs-2'></div>
        </div>;
    }
}

export default withRouter(CourseDisplay);