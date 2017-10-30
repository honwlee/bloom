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
            var data = [{
                "big": "/assets/images/pictures/home/word.jpg",
                "normal": "/assets/images/pictures/home/word.jpg",
                "mini": "/assets/images/pictures/home/word.jpg",
                "desc": "",
                "size": "800x533"
            }, {
                "big": "/assets/images/pictures/home/class.jpg",
                "normal": "/assets/images/pictures/home/class.jpg",
                "mini": "/assets/images/pictures/home/class.jpg",
                "desc": "",
                "size": "800x533"
            }, {
                "big": "/assets/images/pictures/home/back.jpg",
                "normal": "/assets/images/pictures/home/back.jpg",
                "mini": "/assets/images/pictures/home/back.jpg",
                "desc": "",
                "size": "800x533"
            }, {
                "big": "/assets/images/pictures/home/view.jpg",
                "normal": "/assets/images/pictures/home/view.jpg",
                "mini": "/assets/images/pictures/home/view.jpg",
                "desc": "",
                "size": "800x533"
            }, {
                "big": "/assets/images/pictures/home/all.jpg",
                "normal": "/assets/images/pictures/home/all.jpg",
                "mini": "/assets/images/pictures/home/all.jpg",
                "desc": "",
                "size": "800x533"
            }]

            var ps = new photoSwipe({
                photoData: data
            });
            // this._initItyped();
            var psTpl = ps.start();
            var ps = $(psTpl).appendTo($(".photoSwipeContainer"));
        },
        exited: function() {

        }
    });
});
