'use strict';

let filterBooksForProfile = book => ({
    ISBN: book.ISBN,
    title: book.title,
    author: book.author,
});

module.exports = {
    filterBooksForProfile: filterBooksForProfile
}