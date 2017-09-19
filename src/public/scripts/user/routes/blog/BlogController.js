define([
    "skylark/spa",
    "skylark/async",
    "skylark/langx",
    "jquery",
    "skylark/eventer",
    "text!scripts/routes/home/home.html",
    "ityped",
    'countdown'
], function(spa, async, langx, $, eventer, homeTpl, ityped, countdown) {
    return spa.RouteController.inherit({
        klassName: "BlogController",

        preparing: function(e) {
            // var deferred = new async.Deferred();
            // runtime.currentArea.launchApp("Blog").then(function(app) {
            //     e.route.content = $(app.content.domNode).html();
            //     deferred.resolve();
            // });
            // e.result = deferred.promise;
        },

        entered: function() {
            runtime.currentArea.launchApp("Blog");
        },
        exited: function() {

        }
    });
});
