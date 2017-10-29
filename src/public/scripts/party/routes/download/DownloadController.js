define([
    "skylark/spa",
    "skylark/async",
    "skylark/langx",
    "jquery",
    "handlebars",
    "common/partial",
    "skylark/eventer",
    "common/photoSwipe",
    "common/services/server",
    "text!scripts/routes/download/download.html"
], function(spa, async, langx, $, handlebars, partial, eventer, photoSwipe, server, splendidTpl) {
    return spa.RouteController.inherit({
        klassName: "DownloadController",

        data: null,

        rendering: function(e) {
            e.content = splendidTpl;

        },
        entered: function() {},
        exited: function() {

        }
    });
});
