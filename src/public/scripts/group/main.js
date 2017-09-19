require.config({
    baseUrl: "./",
    waitSeconds: 60,
    packages: [{
        name: "skylark",
        location: "/lib/skylark"
    },{
        name: "scripts",
        location: "/scripts/group"
    }, {
        name: "ace",
        main: "ace",
        location: "https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.8"
    }],

    paths: {
        "noext": 'https://cdnjs.cloudflare.com/ajax/libs/requirejs-plugins/1.0.3/noext.min',
        "countdown": "lib/skylarkx/countdown",
        "ityped": "https://unpkg.com/ityped@0.0.5?noext",
        "bootstrap" : "https://cdn.bootcss.com/bootstrap/3.3.6/js/bootstrap.min",
        "handlebars" : "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.10/handlebars.amd.min",
        "jotted" : "https://cdn.jsdelivr.net/jotted/1.5.1/jotted.min",
        // "jquery": "https://cdn.bootcss.com/jquery/2.2.0/jquery.min",
        "jquery" : "lib/skylark.jquery/core",
        "jquery-ajax" : "lib/skylark.jquery/ajax",
        "particles" : "lib/skylarkx/particles",
        // "countdown": "https://cdn.rawgit.com/hilios/jQuery.countdown/2.2.0/dist/jquery.countdown.min"
        "tether" : "https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min",
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

require([
    "skylark/noder",
    "skylark/scripter",
    "skylark/spa",
    "scripts/config/config",
    "jquery",
    "jquery-ajax",
    "lodash"
], function(noder, scripter, spa, config, $) {
    window._goTop = function() {
        $(document.body).animate({
            "scrollTop": 0
        }, 200, function() {
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
                return app.prepare().then(function() {
                    throb.remove();
                    main.style.opacity = 1;
                    return app.run();
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
