'use strict';


import React, { Component } from 'react';
import { withRouter }           from 'react-router-dom';


const BookListing = ({book, index}) => {
    return <tr key={index}>
        <th>{book.seller}</th>
        <th>{book.price}</th>
        <td><a href={`mailto:${book.sellemail}?subject=I'm%20interested%20in%20your%20book`}>Contact Seller</a></td>
    </tr>
};

class BuyingOptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            book: {
                ISBN: '',
                title: '',
                author: '',
                edition: '',
                for_sale: [],
            }
        };

        this.backButton = this.backButton.bind(this);
    }

    componentDidMount() {
        $.ajax({
            url: `/v1/infobook/${this.props.match.params.ISBN}`,
            method: 'get',
        })
            .then(data => {
                this.setState({book: data})
            })
    }

    backButton() {
        this.props.history.push('/browse/');
    }

    render() {

        let forsaleList = this.state.book.for_sale.map((book, index) => (
            <BookListing key={index} book={book} index={index}/>
        ));
        return <div>
            <div className="center-block">
                <p id="errorMsg" className="bg-danger"/>
            </div>
            <button className='btn btn-default' onClick={this.backButton}>Back to Browse</button>

            <h3>Listings for {this.state.book.title}</h3>

            <div className='col-xs-12'>
                <div className='col-xs-2'>
                    <img src='/images/book_placeholder.png' className="book-cover"/>
                </div>
                <div className='col-xs-10'>
                    <div className='col-xs-2'>
                        <h4>ISBN:</h4>
                        <h4>Author:</h4>
                        <h4>Edition:</h4>
                    </div>
                    <div className='col-xs-9'>
                        <h4>{this.state.book.ISBN}</h4>
                        <h4>{this.state.book.author}</h4>
                        <h4>{this.state.book.edition}</h4>
                    </div>
                </div>
                <hr/>
            </div>
            <div className='col-xs-8'>
                <table id='have-list' className='table'>
                    <thead>
                    <tr>
                        <th>Seller</th>
                        <th>Price</th>
                    </tr>
                    </thead>
                    <tbody>{forsaleList}</tbody>
                </table>
            </div>
        </div>;
    }
}


export default withRouter(BuyingOptions);