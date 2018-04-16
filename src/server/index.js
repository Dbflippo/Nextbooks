'use strict';

let path            = require('path'),
    express         = require('express'),
    bodyParser      = require('body-parser'),
    logger          = require('morgan'),
    session         = require('express-session'),
    mongoose        = require('mongoose');

mongoose.Promise = global.Promise;
let port = process.env.PORT ? process.env.PORT : 8080;
let env = process.env.NODE_ENV ? process.env.NODE_ENV : 'dev';

/**********************************************************************************************************/

// Setup our Express pipeline
let app = express();
app.use(express.static(path.join(__dirname, '../../public')));
if (env !== 'test') app.use(logger('dev'));
app.engine('pug', require('pug').__express);
app.set('views', __dirname);
// Setup pipeline session support
app.use(session({
    name: 'session',
    secret: 'supersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/',
        httpOnly: false,
        secure: false
    }
}));
// Finish pipeline setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to mongoDB
let options = {
    useMongoClient: true
};
mongoose.connect('mongodb://127.0.0.1:27017/nextbooks', options)
    .then(() => {
        console.log('\t MongoDB connected');

        // Import our Data Models
        app.models = {
            User: require('./models/user'),
            InfoBook: require('./models/infobook'),
            ForSaleBook: require('./models/forsalebook'),
            Course: require('./models/course'),
        };

        // Import our API Routes
        require('./api/v1/user')(app);
        require('./api/v1/session')(app);
        require('./api/v1/forsalebook')(app);
        require('./api/v1/infobook')(app);
        require('./api/v1/course')(app);

        // Give them the SPA base page
        app.get('*', (req, res) => {
            let preloadedState = req.session.user ? {
                    username: req.session.user.username,
                    primary_email: req.session.user.primary_email,
                    first_name: req.session.user.first_name,
                    school: req.session.user.school
                } : {};
            preloadedState = JSON.stringify(preloadedState).replace(/</g, '\\u003c');
            res.render('base.pug', {
                state: preloadedState
            });
        });
    }, err => {
        console.log(err);
    });

/**********************************************************************************************************/

// Run the server itself
let server = app.listen(port, () => {
    console.log('Nextbooks app listening on ' + server.address().port);
});
