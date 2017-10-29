'use strict';
const path = require('path');
const ctrls = require("../controllers/controllers");
const start = require("../controllers/StartController");
module.exports = function(app, ensureAuthenticated) {
    // api
    Object.keys(ctrls).forEach(function(key) {
        ["update", "create", "show", "delete", "index"].forEach(function(name) {
            let method;
            let action;
            let matcher = name.match(/^(show|index)/)
            if (matcher) {
                method = "get";
                action = matcher[0];
            } else {
                action = name;
                method = "post";
            }
            app[method]('/api/' + key + '/' + name, ensureAuthenticated, function(req, res) {
                ctrls[key][action](req, res);
            });
        });
    });

    app.get('/api/contacts/import', ensureAuthenticated, function(req, res) {
        ctrls.contacts.import(req, res);
    });

    app.get('/api/users/public/show', function(req, res) {
        ctrls.users.publicShow(req, res);
    });

    app.get('/api/contacts/download', ensureAuthenticated, function(req, res) {
        ctrls.contacts.download(req, res);
    });

    app.get('/api/contacts/download-size', ensureAuthenticated, function(req, res) {
        ctrls.contacts.downloadSize(req, res);
    });

    app.get('/api/download/pictures', ensureAuthenticated, function(req, res) {
        var file = path.join(__dirname,  '../data/pictures.zip');
        res.download(file); // Set disposition and send it.
    });

    app.get('/api/events/import', ensureAuthenticated, function(req, res) {
        ctrls.events.import(req, res);
    });

    app.get('/api/start', ensureAuthenticated, function(req, res) {
        start.index(req, res);
    });
};
