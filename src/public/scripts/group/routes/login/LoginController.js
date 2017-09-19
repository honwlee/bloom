define([
    "skylark/spa",
    "text!scripts/routes/login/login.html",
], function(spa, startTpl) {
    return spa.RouteController.inherit({
        klassName: "StartController",

        rendering: function(e) {
            e.content = startTpl;
        },

        entered: function() {

        },
        exited: function() {

        }
    });
});
