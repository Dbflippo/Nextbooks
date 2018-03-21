'use strict';

let filterOwnedBooksForProfile = book => ({
    ISBN: book.ISBN,
    title: book.title,
    author: book.author,
    price: book.price,
});

let filterWantedBooksForProfile = book => ({
    ISBN: book.ISBN,
    title: book.title,
    author: book.author,
});

module.exports = {
    filterOwnedBooksForProfile: filterOwnedBooksForProfile,
    filterWantedBooksForProfile: filterWantedBooksForProfile
};