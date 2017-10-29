define([
    "skylark/spa",
    "skylark/async",
    "skylark/langx",
    "jquery",
    "skylark/eventer",
    "common/services/server",
    "common/auth/AuthController",
    "text!scripts/routes/auth/auth.html"
], function(spa, async, langx, $, eventer, server, AuthController, authTpl) {
    return spa.RouteController.inherit({
        klassName: "AuthController",
        rendering: function(e) {
            e.content = authTpl;
        },

        rendered: function() {
            var authFunc = AuthController();
            authFunc.getNode().appendTo($("#authContainer").empty());
            authFunc.show();
        },

        entered: function() {},
        exited: function() {}
    });
});
