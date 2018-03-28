"use strict";

let Joi             = require('joi');
let Books           = require('../../books');

const validatePassword = password => {
    // Validate password more
    if (!password.match(/[0-9]/i)) {
        return { error: '"password" must contain at least one numeric character' };
    }
    else if (!password.match(/[a-z]/)) {
        return { error: '"password" must contain at least one lowercase character' };
    }
    else if (!password.match(/[A-Z]/)) {
        return { error: '"password" must contain at least one uppercase character' };
    }
};

module.exports = (app) => {

    /*
     * Create a new user
     *
     * @param {req.body.username} Display name of the new user
     * @param {req.body.first_name} First name of the user
     * @param {req.body.last_name} Last name of the user
     * @param {req.body.school} The school the user attends
     * @param {req.body.primary_email} Email address of the user
     * @param {req.body.password} Password for the user
     * @return {201, {username,primary_email}} Return username and others
     */
    app.post('/v1/user', function(req, res) {
        // Schema for user info validation
        let schema = Joi.object().keys({
            username:       Joi.string().lowercase().alphanum().min(3).max(32).required(),
            primary_email:  Joi.string().lowercase().email().required(),
            first_name:     Joi.string().required(),
            last_name:      Joi.string().required(),
            school:         Joi.string().required(),
            password:       Joi.string().min(8).required()
        });
        // Validate user input
        Joi.validate(req.body, schema, { stripUnknown: true }, (err, data) => {
            if (err) {
                const message = err.details[0].message;
                console.log(`User.create validation failure: ${message}`);
                res.status(400).send({ error: message });
            } else {
                // Deeper password validation
                const pwdErr = validatePassword(data.password);
                if (pwdErr) {
                    console.log(`User.create password validation failure: ${pwdErr.error}`);
                    res.status(400).send(pwdErr);
                    return;
                }
                // Try to create the user
                let user = new app.models.User(data);
                user.save().then(
                    () => {
                        // Send the happy response back
                        res.status(201).send({
                            username:       data.username,
                            primary_email:  data.primary_email,
                            first_name:     data.first_name,
                            school:         data.school
                        });
                    }, err => {
                        // Error if username is already in use
                        if (err.code === 11000) {
                            if (err.message.indexOf('username_1') !== -1)
                                res.status(400).send({error: 'username already in use'});
                            if (err.message.indexOf('primary_email_1') !== -1)
                                res.status(400).send({error: 'email address already in use'});
                        }
                        // Something else in the username failed
                        else res.status(400).send({error: 'invalid username'});

                    }
                );
            }
        });
    });

    /*
     * See if user exists
     *
     * @param {req.params.username} Username of the user to query for
     * @return {200 || 404}
     */
    app.head('/v1/user/:username', (req, res) => {
        app.models.User.findOne({ username: req.params.username.toLowerCase() })
            .then(
                user => {
                    if (!user) res.status(404).send({ error: `unknown user: ${req.params.username}` });
                    else res.status(200).end();
                }, err => {
                    console.log(err);
                    res.status(500).send({ error: 'server error' });
                }
            );
    });

    /*
     * Fetch user information
     *
     * @param {req.params.username} Username of the user to query for
     * @return {200, {username, primary_email, first_name, last_name, school, games[...]}}
     */
    app.get('/v1/user/:username', (req, res) => {
        app.models.User.findOne({ username: req.params.username.toLowerCase() })
            .populate('wanted_books')
            .populate('owned_books')
            .exec()
            .then(
                user => {
                    if (!user) res.status(404).send({ error: `unknown user: ${req.params.username}` });
                    else {
                        const filteredWantedBooks = user.wanted_books.map(book => Books.filterWantedBooksForProfile(book));
                        const filteredOwnedBooks = user.owned_books.map(book => Books.filterOwnedBooksForProfile(book));

                        res.status(200).send({
                            username:       user.username,
                            primary_email:  user.primary_email,
                            first_name:     user.first_name,
                            last_name:      user.last_name,
                            school:         user.school,
                            wanted_books:   filteredWantedBooks,
                            owned_books:    filteredOwnedBooks,
                        });
                    }
                }, err => {
                    console.log(err);
                    res.status(500).send({ error: 'server error' });
                }
            );
    });


    app.put('/v1/user', (req, res) => {
        if (!req.session.user) {
            res.status(401).send({ error: 'unauthorized' });
        } else {
            if(req.body.wanted_books === undefined) {
                req.body.wanted_books = [];
            }
            let userAlreadyWants = false;
            req.body.wanted_books.forEach((book) => {
                if (book.ISBN === req.body.ISBN) {
                    userAlreadyWants = true;
                }
            });
            if(userAlreadyWants) {
                console.log("User already wants this book");
                res.status(400).end();
            }
            else {
                const query = {$push: {wanted_books: req.body.id}};
                app.models.User.findOneAndUpdate({_id: req.session.user._id}, query, {new: true})
                    .populate('wanted_books')
                    .populate('owned_books')
                    .exec()
                    .then(
                        user => {
                            res.status(201).send(user.wanted_books);
                        }, err => {
                            console.log(err);
                            res.status(501).end()
                        }
                    );
            }
        }
    });

};
