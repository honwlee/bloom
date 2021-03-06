require.config({
    baseUrl: "./",
    waitSeconds: 60,
    packages: [{
        name: "common",
        location: "./common"
    }, {
        name: "scripts",
        location: "./scripts/home"
    }],

    paths: {
        "skylark-all": "/lib/skylark-all",
        "jquery": "https://cdn.bootcss.com/jquery/2.2.0/jquery.min",
        // "jquery": "/lib/skylark-jquery-all.min",
        "noext": 'https://cdnjs.cloudflare.com/ajax/libs/requirejs-plugins/1.0.3/noext.min',
        "countdown": "/lib/countdown",
        "modernizr": "https://cdn.bootcss.com/modernizr/2.8.3/modernizr",
        "ityped": "https://unpkg.com/ityped@0.0.5?noext",
        "toastr": "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min",
        "bootstrap": "https://cdn.bootcss.com/bootstrap/3.3.6/js/bootstrap.min",
        "handlebars": "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.10/handlebars.amd.min",
        "tether": "https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min",
        "text": "https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text",
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
        "jquery"
    ], function(noder, scripter, router, spa, config, $) {
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
                        window.currentUser = app.currentUser = user;
                        return app.prepare().then(function() {
                            main.style.opacity = 1;
                            router.one("prepared", function(e) {
                                throb.remove();
                            });
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
