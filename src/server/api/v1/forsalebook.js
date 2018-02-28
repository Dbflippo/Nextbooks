'use strict';

let Joi = require('joi');

module.exports = app => {

    app.post('/v1/forsalebook', (req, res) => {
        let schema = Joi.object().keys({
            ISBN:       Joi.string().alphanum().min(13).max(13).required(),
            title:      Joi.string().lowercase().required(),
            author:     Joi.string().lowercase().required(),
            edition:    Joi.string(),
            price:      Joi.number().required(),
            seller:     Joi.string().required(),
            school:     Joi.string().required(),
        });
        Joi.validate(req.body, schema, {stripUnknown: true}, (err, data) => {
            if(err) {
                const message = err.details[0].message;
                console.log('Book create validation failure');
                res.status(400).send({error: message});
            } else {
                let forsalebook = new app.models.ForSaleBook(data);
                forsalebook.save().then(
                    () => {
                        const query = { $push: { owned_books: forsalebook._id }};
                        // Save game to user's document too
                        app.models.User.findOneAndUpdate({ _id: req.session.user._id }, query, () => {
                            const query2 = { $push: { for_sale: forsalebook._id }};
                            app.models.InfoBook.findOneAndUpdate({ ISBN: data.ISBN }, query2, () => {
                                res.status(201).send({
                                    ISBN: data.ISBN,
                                });
                            });
                        });
                    }, err => {
                        console.log(err);
                        res.status(400).send({error: 'An error occurred'});
                    }
                )
            }
        });
    })
}