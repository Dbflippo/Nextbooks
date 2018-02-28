"use strict";

let Joi             = require('joi');

module.exports = (app) => {

    app.get('/v1/infobooks', (req, res) => {
        let infobooks = app.models.InfoBook.map(infobook => infobook.ISBN);
        res.status(200).send(infobooks);
    });

    app.get('/v1/infobook/:ISBN', (req, res) => {
        app.models.InfoBook.findOne({ ISBN: req.params.ISBN })
            .exec()
            .then(
                book => {
                    if (!book) res.status(404).send({ error: `unknown book: ${req.params.ISBN}` });
                    else {
                        res.status(200).send({
                            ISBN:           user.ISBN,
                            author:         user.author,
                            title:          user.title,
                            edition:        user.last_name,
                            for_sale:       user.for_sale,
                        });
                    }
                }, err => {
                    console.log(err);
                    res.status(500).send({ error: 'server error' });
                }
            );
    });

};