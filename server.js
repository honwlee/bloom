'use strict';
const express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    methodOverride = require('method-override'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    exphbs = require('express-handlebars'),
    funcs = require('./src/auth/functions.js'),
    jsonServer = require('json-server'),
    app = express(),
    routes = require('./src/routes/routes'),
    port = process.env.PORT || 9999; //select your port or let it pull from your .env file
require('./src/auth/passport.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs.create({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
}).engine);
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/src/public')));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({ secret: 'supernova', saveUninitialized: true, resave: true }));
app.use(passport.initialize());
app.use(passport.session());

// Session-persisted message middleware
app.use(function(req, res, next) {
    let err = req.session.error,
        msg = req.session.notice,
        success = req.session.success;

    delete req.session.error;
    delete req.session.success;
    delete req.session.notice;

    if (err) res.locals.error = err;
    if (msg) res.locals.notice = msg;
    if (success) res.locals.success = success;

    next();
});

routes(app);

app.listen(port);
console.log("listening on " + port + "!");
module.exports = app;
