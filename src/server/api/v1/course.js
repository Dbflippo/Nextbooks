'use strict';

let Joi = require('joi');

module.exports = (app) => {

    //check if course exists
    app.head('v1/course/:school/:department/:number', (req, res) => {
        app.models.Course.findOne({school: req.params.school, department: req.params.department, number: req.params.number})
            .then(
                course => {
                    if(!course) res.status(404).send({ error: 'course not found'});
                    else res.status(200).end();
                }, err => {
                    res.status(500).send({ error: 'server error'})
                }
            )
    });

    app.get('/v1/course/:school/:department/:number', (req, res) => {
        app.models.Course.findOne({school: req.params.school, department: req.params.department, number: req.params.number})
            //.populate('books')
            .exec()
            .then(
                course => {
                    if (!course) res.status(404).send({ error: `unknown course` });
                    else {
                        res.status(200).send({
                            school:             course.school,
                            department:         course.department,
                            number:             course.number,
                            name:               course.name,
                            professor:          course.professor,
                            //books:              course.books,
                        });
                    }
                }, err => {
                    console.log(err);
                    res.status(500).send({ error: 'server error' });
                }
            )
    });

    app.get('/v1/courses', (req, res) => {
        app.models.InfoBook.find()
            .exec()
            .then(
                courses => {
                    res.status(200).send(courses)
                }, err => {
                    console.log(err);
                    res.status(500).send({ error: 'server error'});
                }
            )
    });

    app.post('/v1/course', (req, res) => {
        let schema = Joi.object().keys({
            school:         Joi.string().required(),
            department:     Joi.string().required(),
            number:         Joi.string().required(),
            name:           Joi.string().required(),
            professor:      Joi.string()
            //books:          Joi.array(),
        });
        Joi.validate(req.body, schema, {stripUnknown: true}, (err, data) => {
            if(err) {
                const message = err.details[0].message;
                console.log('Course create validation failure');
                res.status(400).send({ error: message });
            } else {
                let course = new app.models.Course(data);
                course.save().then(
                    () => {
                        res.status(201).send({
                            school: data.school,
                            department: data.department,
                            number: data.number,
                        });
                    }, err => {
                        // needs fix
                        if (err.code === 11000) {
                            if (err.message.indexOf('courseId_1') !== -1)
                                res.status(400).send({error: 'courseId already in use'});
                        }
                    }
                )
            }
        })
    });


};