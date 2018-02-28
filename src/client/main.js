"use strict";

// Necessary modules
import React, { Component }     from 'react';
import { render }               from 'react-dom';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';

import Header                   from './components/header';
import Landing                  from './components/landing';
import Login                    from './components/login';
import Register                 from './components/register';
import Logout                   from './components/logout';
import Profile                  from './components/profile';
import RegisterBook             from './components/registerbook';
import CheckBook                from './components/checkbook';

// Bring app CSS into the picture
require('./app.css');

/*************************************************************************/

class MyApp extends Component {
    constructor(props) {
        super(props);
        this.user = new User(
            window.__PRELOADED_STATE__.username,
            window.__PRELOADED_STATE__.primary_email,
            window.__PRELOADED_STATE__.first_name,
            window.__PRELOADED_STATE__.school,
        );
        this.book = new Book("0000000000000")
    }

    render() {
        return <BrowserRouter>
            <div>
                <Header user={this.user}/>
                <Route exact path="/" component={Landing}/>
                <Route path="/login" render={() => {
                    return this.user.loggedIn() ?
                        <Redirect to={`/profile/${this.user.username()}`}/> :
                        <Login user={this.user}/>
                }}/>
                <Route path="/register" render={() => {
                    return this.user.loggedIn() ?
                        <Redirect to={`/profile/${this.user.username()}`}/> :
                        <Register/>;
                }}/>
                <Route path="/logout" render={() => <Logout user={this.user}/>}/>
                <Route path="/profile/:username" render={() => <Profile user={this.user}/>}/>
                <Route path="/checkbook" render={() => <CheckBook book={this.book}/>}/>
                <Route path="/registerbook/:ISBN" render={()=> <RegisterBook user={this.user}/>}/>
            </div>
        </BrowserRouter>;
    }
}

class Book {
    constructor(ISBN) {
        if(ISBN) {
            this.data = {
                ISBN: ISBN
            };
        } else {
            this.data = {
                ISBN: ""
            };
        }
    }

    RegisterBook(router, data) {
        this.data = data;
        router.push(`/registerbook/${data.ISBN}`)
    }
}

class User {
    constructor(username, primary_email, first_name, school) {
        if (username && primary_email && first_name && school) {
            this.data = {
                username: username,
                primary_email: primary_email,
                first_name: first_name,
                school: school
            };
        } else {
            this.data =  {
                username: "",
                primary_email: "",
                first_name: "",
                school: "",
            };
        }
    }

    loggedIn() {
        return this.data.username && this.data.primary_email && this.data.first_name && this.data.school;
    }

    username() {
        return this.data.username;
    }

    logIn(router, data) {
        // Store locally
        this.data = data;
        // Go to user profile
        router.push(`/profile/${data.username}`);
    }

    logOut(router) {
        // Remove user info
        this.data = {
            username: "",
            primary_email: "",
            first_name: "",
            school: ""
        };
        // Go to login page
        router.push('/login');
    }

    getUser() {
        return this.data;
    }
}

render(
    <MyApp/>,
    document.getElementById('mainDiv')
);
