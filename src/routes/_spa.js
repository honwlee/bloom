'use strict';
module.exports = function(app, ensureAuthenticated) {
    ["", "game", "about", "invitative", "login"].forEach(function(name) {
        app.get('/' + name, function(req, res) {
            if (req.user) {
                res.redirect('/party/profile');
            } else {
                res.render('index', {
                    layout: 'home'
                });
            }
        });
    });

    ["", "splendid", "contact", "profile", "u/:username", "pictures", "download"].forEach(function(name) {
        app.get("/party/" + name, ensureAuthenticated, function(req, res) {
            res.render('party', {
                token: req.user.token,
                user: req.user,
                layout: 'party'
            });
        });
    });

    app.get("/public/users/:username", function(req, res) {
        res.render('party', {
            user: req.user,
            layout: 'party'
        });
    });

};
