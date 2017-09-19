require.config({
    baseUrl: "/",
    waitSeconds: 60,
    packages: [{
        name: "common",
        location: "/common"
    }, {
        name: "scripts",
        location: "/scripts/party"
    }, {
        name: "data",
        location: "/data"
    }],

    paths: {
        "skylark-all": "/lib/skylark-all",
        "jquery": "https://cdn.bootcss.com/jquery/2.2.0/jquery.min",
        // "jquery": "/lib/skylark-jquery-all.min",
        "photoswipe": "https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.2/photoswipe.min",
        "photoswipeUi": "https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.2/photoswipe-ui-default.min",
        "noext": 'https://cdnjs.cloudflare.com/ajax/libs/requirejs-plugins/1.0.3/noext.min',
        "countdown": "/lib/countdown",
        "modernizr": "https://cdn.bootcss.com/modernizr/2.8.3/modernizr",
        "ityped": "https://unpkg.com/ityped@0.0.5?noext",
        "toastr": "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min",
        "bootstrap": "https://cdn.bootcss.com/bootstrap/3.3.6/js/bootstrap.min",
        "handlebars": "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.10/handlebars.amd.min",
        "jotted": "https://cdn.jsdelivr.net/jotted/1.5.1/jotted.min",
        "tether": "https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min",
        "cropper": "/lib/cropper",
        // "cropper": "https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.0.0/cropper.min",
        "text": "https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text",
        "bootstrap-table": "//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.11.1/bootstrap-table",
        "bootstrap-table-zh-CN": "//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.11.1/locale/bootstrap-table-zh-CN.min",
        "tableExport": "http://rawgit.com/hhurz/tableExport.jquery.plugin/master/tableExport",
        "bt-export": "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.11.1/extensions/export/bootstrap-table-export",
        "bt-mobile": "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.11.1/extensions/mobile/bootstrap-table-mobile",
        "bt-cookie": "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.11.1/extensions/cookie/bootstrap-table-cookie",
        "lodash": "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min"
    },
    shim: {
        "bootstrap": {
            deps: ["jquery"],
            exports: "$"　
        }
    }
});

require(["skylark-all"], function() {
    require([
        "skylark/noder",
        "skylark/scripter",
        "skylark/router",
        "skylark/spa",
        "scripts/config/config",
        "common/services/server",
        "jquery"
    ], function(noder, scripter, router, spa, config, server, $) {
        window._goTop = function(time) {
            time = time || 200;
            $(document.body).animate({
                "scrollTop": 0
            }, time, function() {
                goTopShown = false;
            });
            $(".go-top-btn").css({
                opacity: 0
            }).hide();
        };
        window.addThrob = function(node, callback) {
            $(node).css("opacity", 0.5);
            return noder.throb(node, {
                callback: callback
            });
        };
        var goTop = function(selector) {
            var goTopShown = false;
            selector.css({
                opacity: 0
            }).on("click", function() {
                window._goTop();
            });

            $(window).scroll(function() {
                if (goTopShown && window.scrollY > 0) return;
                if (window.scrollY > 100) {
                    selector.css({
                        opacity: 1
                    }).show();
                    goTopShown = true;
                } else {
                    selector.css({
                        opacity: 0
                    }).hide();
                    goTopShown = false;
                }
            });
        };
        var main = $("#main-wrap")[0],
            throb = window.addThrob(main, function() {
                require(["bootstrap"], function() {
                    var app = spa(config);
                    return server().user("get", "show").then(function(user) {
                        return app.prepare().then(function() {
                            main.style.opacity = 1;
                            router.one("prepared", function(e) {
                                throb.remove();
                            });
                            window.currentUser = app.currentUser = user;
                            return app.run();
                        });
                    });
                });
            });
        goTop($(".go-top-btn"));
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            $("#sk-navbar").delegate(".nav-item", "click", function(e) {
                $('#sk-navbar').collapse('hide');
            });
            $(".logo-nav").on("click", function() {
                $('#sk-navbar').collapse('hide');
            })
            $(".navbar").addClass("navbar-default");
        }
    });
});
