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
    "text!scripts/routes/pictures/pictures.html"
], function(spa, async, langx, $, handlebars, partial, eventer, photoSwipe, server, splendidTpl) {
    return spa.RouteController.inherit({
        klassName: "PicturesController",

        data: null,

        rendering: function(e) {
            e.content = splendidTpl;

        },
        entered: function() {
            var ps = new photoSwipe({
                    photoData: [{
                        "big": "/assets/images/pictures/party/hill-view.jpg",
                        "normal": "/assets/images/pictures/party/hill-view.jpg",
                        "mini": "/assets/images/pictures/party/hill-view.jpg",
                        "desc": "",
                        "size": "800x533"
                    }, {
                        "big": "/assets/images/pictures/party/hill1.jpg",
                        "normal": "/assets/images/pictures/party/hill1.jpg",
                        "mini": "/assets/images/pictures/party/hill1.jpg",
                        "desc": "",
                        "size": "800x533"
                    }, {
                        "big": "/assets/images/pictures/party/hill2.jpg",
                        "normal": "/assets/images/pictures/party/hill2.jpg",
                        "mini": "/assets/images/pictures/party/hill2.jpg",
                        "desc": "",
                        "size": "800x533"
                    }, {
                        "big": "/assets/images/pictures/party/hill3.jpg",
                        "normal": "/assets/images/pictures/party/hill3.jpg",
                        "mini": "/assets/images/pictures/party/hill3.jpg",
                        "desc": "",
                        "size": "800x533"
                    }, {
                        "big": "/assets/images/pictures/party/hill4.jpg",
                        "normal": "/assets/images/pictures/party/hill4.jpg",
                        "mini": "/assets/images/pictures/party/hill4.jpg",
                        "desc": "",
                        "size": "800x533"
                    }, {
                        "big": "/assets/images/pictures/party/hill5.jpg",
                        "normal": "/assets/images/pictures/party/hill5.jpg",
                        "mini": "/assets/images/pictures/party/hill5.jpg",
                        "desc": "",
                        "size": "800x533"
                    }, {
                        "big": "/assets/images/pictures/party/hill6.jpg",
                        "normal": "/assets/images/pictures/party/hill6.jpg",
                        "mini": "/assets/images/pictures/party/hill6.jpg",
                        "desc": "",
                        "size": "800x533"
                    }, {
                        "big": "/assets/images/pictures/party/hill-all.jpg",
                        "normal": "/assets/images/pictures/party/hill-all.jpg",
                        "mini": "/assets/images/pictures/party/hill-all.jpg",
                        "desc": "",
                        "size": "800x533"
                    }, {
                        "big": "/assets/images/pictures/party/hill-all1.jpg",
                        "normal": "/assets/images/pictures/party/hill-all1.jpg",
                        "mini": "/assets/images/pictures/party/hill-all1.jpg",
                        "desc": "",
                        "size": "800x533"
                    }, {
                        "big": "/assets/images/pictures/party/hotel.jpg",
                        "normal": "/assets/images/pictures/party/hotel.jpg",
                        "mini": "/assets/images/pictures/party/hotel.jpg",
                        "desc": "",
                        "size": "800x533"
                    }, {
                        "big": "/assets/images/pictures/party/hotel-all.jpg",
                        "normal": "/assets/images/pictures/party/hotel-all.jpg",
                        "mini": "/assets/images/pictures/party/hotel-all.jpg",
                        "desc": "",
                        "size": "800x533"
                    }, {
                        "big": "/assets/images/pictures/party/school-all.jpg",
                        "normal": "/assets/images/pictures/party/school-all.jpg",
                        "mini": "/assets/images/pictures/party/school-all.jpg",
                        "desc": "",
                        "size": "800x533"
                    }, {
                        "big": "/assets/images/pictures/party/school-all1.jpg",
                        "normal": "/assets/images/pictures/party/school-all1.jpg",
                        "mini": "/assets/images/pictures/party/school-all1.jpg",
                        "desc": "",
                        "size": "800x533"
                    }, {
                        "big": "/assets/images/pictures/party/school-all2.jpg",
                        "normal": "/assets/images/pictures/party/school-all2.jpg",
                        "mini": "/assets/images/pictures/party/school-all2.jpg",
                        "desc": "",
                        "size": "800x533"
                    }, {
                        "big": "/assets/images/pictures/party/class.jpg",
                        "normal": "/assets/images/pictures/party/class.jpg",
                        "mini": "/assets/images/pictures/party/class.jpg",
                        "desc": "",
                        "size": "800x533"
                    }, {
                        "big": "/assets/images/pictures/party/class-all.jpg",
                        "normal": "/assets/images/pictures/party/class-all.jpg",
                        "mini": "/assets/images/pictures/party/class-all.jpg",
                        "desc": "",
                        "size": "800x533"
                    }, {
                        "big": "/assets/images/pictures/party/sports.jpg",
                        "normal": "/assets/images/pictures/party/sports.jpg",
                        "mini": "/assets/images/pictures/party/sports.jpg",
                        "desc": "",
                        "size": "800x533"
                    }]
                }),
                psTpl = ps.start();
            $(psTpl).appendTo($(".photoSwipeContainer"));
        },
        exited: function() {

        }
    });
});
