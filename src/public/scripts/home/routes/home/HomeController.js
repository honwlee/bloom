define([
    "skylark/spa",
    "skylark/async",
    "skylark/langx",
    "jquery",
    "skylark/eventer",
    "common/services/server",
    "text!scripts/routes/home/home.html",
    "common/photoSwipe",
    "ityped",
    'countdown'
], function(spa, async, langx, $, eventer, server, homeTpl, photoSwipe, ityped, countdown) {
    return spa.RouteController.inherit({
        klassName: "HomeController",
        data: null,
        preparing: function(e) {
            var deferred = new async.Deferred(),
                self = this;
            var main = $("#main-wrap")[0],
                throb = window.addThrob(main, function() {
                    server().start().then(function(data) {
                        self.data = data;
                        deferred.resolve();
                        throb.remove();
                        main.style.opacity = 1;
                    });
                });
            e.result = deferred.promise;
        },

        _initItyped: function() {
            var timeout, self = this;
            ityped.init('#homeItyped', {
                strings: ['犹记那时花草，那份执着，那些看不清却能连接彼此的线。'],
                loop: true,
                typeSpeed: 200, //default
                //optional
                backSpeed: 200, //default
                //optional
                startDelay: 200, //default
                //optional
                backDelay: 500, //default
                //optional
                //optional
                showCursor: true, //default
                //optional
                cursorChar: "|", //default
            });
        },

        rendering: function(e) {
            e.content = homeTpl;
        },

        entered: function() {
            var ps = new photoSwipe({
                photoData: this.data.photos
            });
            this._initItyped();
            var psTpl = ps.start();
            $(psTpl).appendTo($(".photoSwipeContainer"));
        },
        exited: function() {

        }
    });
});
