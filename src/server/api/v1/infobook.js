
'use strict';

let Joi = require('joi');
let Books           = require('../../books');


module.exports = (app) => {

    //check to see if the book exists in the system
    app.head('/v1/infobook/:ISBN', (req, res) => {
        app.models.InfoBook.findOne({ISBN: req.params.ISBN})
            .then(
                book => {
                    if (!book) res.status(404).send({ error: 'book not found'});
                    else res.status(200).end();
                }, err => {
                    res.status(500).send({ error: 'server error'})
                }
            )
    });

    app.get('/v1/infobook/:ISBN', (req, res) => {
       app.models.InfoBook.findOne({ISBN: req.params.ISBN})
           .populate('for_sale')
           .exec()
           .then(
               book => {
                   if (!book) res.status(404).send({ error: `unknown book: ${req.params.ISBN}` });
                   else {
                       const filteredForSale = book.for_sale.map(fsbook => Books.filterBooksForProfile(fsbook));
                       res.status(200).send({
                           ISBN:            book.ISBN,
                           title:           book.title,
                           author:          book.author,
                           edition:         book.edition,
                           for_sale:        filteredForSale,
                       });
                   }
               }, err => {
                   console.log(err);
                   res.status(500).send({ error: 'server error' });
               }
           )
    });

    app.get('/v1/infobooks', (req, res) => {
        let infobooks = app.models.InfoBook.map();
        res.status(200).send(infobooks);
    });

    app.post('/v1/infobook', (req, res) => {
        let schema = Joi.object().keys({
            ISBN:       Joi.string().alphanum().min(13).max(13).required(),
            title:      Joi.string().lowercase().required(),
            author:     Joi.string().lowercase().required(),
            edition:    Joi.string()
        });
        Joi.validate(req.body, schema, {stripUnknown: true}, (err, data) => {
            if(err) {
                const message = err.details[0].message;
                console.log('Book create validation failure');
                res.status(400).send({ error: message });
            } else {
                let infobook = new app.models.InfoBook(data);
                infobook.save().then(
                    () => {
                        res.status(201).send({
                            ISBN: data.ISBN,
                        });
                    }, err => {
                        if (err.code === 11000) {
                            if (err.message.indexOf('ISBN_1') !== -1)
                                res.status(400).send({error: 'ISBN already in use'});
                        }
                    }
                )
            }
        })
    });



};