(function(global) {
    //
    var eval_ =
        // use the function constructor so our eval is scoped close to (but not in) in the global space with minimal pollution
        new Function('return eval(arguments[0]);'),

        eval = function(text, hint) {
            return eval_(text + "\r\n////@ sourceURL=" + hint);
        },
        loadjs = function(url, callback, doc) {
            var initialized = false;
            doc = doc || document;
            var e = doc.createElement("script");
            e.type = "text/javascript";
            e.src = url;
            e.charset = "utf-8";
            e.async = false;
            e.onload = function() {
                if (!initialized) {
                    initialized = true;
                    callback();
                }
            };

            e.onreadystatechange = function() {
                if (!initialized) {
                    switch (e.readyState) {
                        case "loaded":
                        case "complete":
                            initialized = true;
                            callback();
                            break;
                    }
                }
            };
            doc.getElementsByTagName("head")[0].appendChild(e);
        },
        loadcss = function(url, doc) {
            doc = doc || document;
            var link = doc.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = url;
            doc.getElementsByTagName('head')[0].appendChild(link);
        };

    var scripts = document.getElementsByTagName("script"),
        i = 0,
        script,
        bootstrapDir,
        homeUrl,
        src,
        match,
        config = {},
        engine_version = "v1.0",
        locale = "en",
        extra_locale,
        shellId,
        bundleSourceMode,
        centerUrl,
        apiUrl,
        nodeStarted;

    while (i < scripts.length) {
        script = scripts[i++];
        if ((src = script.getAttribute("src")) && (match = src.match(/(((.*)\/)|^)booter\.dev\.js(\W|$)/i))) {
            // sniff bootstrapDir and baseUrl
            bootstrapDir = match[3] || "";
            console.log(bootstrapDir + "=" + bootstrapDir);

            var i1 = bootstrapDir.lastIndexOf("/");
            console.log("i1" + "=" + i1);

            //homeUrl = i1 > -1 ? bootstrapDir.substring(0, i1 + 1) : bootstrapDir;
            homeUrl = bootstrapDir + "/"
            // homeUrl = bootstrapDir + "/v1/"

            console.log("homeUrl" + "=" + homeUrl);
            shellId = script.getAttribute("shell-id");

            break;
        }
    }
    var udeConfig = global.ude_config;
    if (udeConfig) {
        shellId = udeConfig.shellId;
        centerUrl = udeConfig.centerUrl;
        homeUrl = udeConfig.udeUrl + "/";
        apiUrl = udeConfig.apiUrl;
        bundleSourceMode = udeConfig.bundleSourceMode;
        nodeStarted = udeConfig.nodeStarted,
            debugging = udeConfig.debugging;
    }
    centerUrl = centerUrl ? centerUrl : "http://center.utilhub.dt.hudaokeji.com";
    apiUrl = apiUrl ? apiUrl : "http://localhost:3000";
    if (nodeStarted !== undefined && nodeStarted === false) {
        nodeStarted = false;
    } else {
        nodeStarted = true;
    }
    var config = global.dojoConfig = {
        async: true,
        isDebug: true,
        parseOnLoad: true,
        locale: "zh-cn",
        waitSeconds: 60,
        baseUrl: homeUrl,
        gfxRenderer: "canvas",
        has: {
            "dojo-bidi": true
        },

        aliases: [ // for dojo
            ["text", "dojo/text"],
            ["i18n", "dojo/i18n"],
            ["domReady", "dojo/domReady"],
            //            ["jquery", "djquery"],
            ["zepto", "djquery"]
        ],
        map: { //  for requirejs
            "*": {
                //                 text : "dojo/text",
                //                 i18n : "dojo/i18n",
                text: "qscript/system/loader/text",
                i18n: "qscript/system/loader/i18n",
                ready: "qscript/system/loader/ready",
                domReady: "qscript/system/loader/ready",
                //                jquery: "djquery",
                zepto: "djquery"
            }
        },
        paths: {
            "skylark-all": "/lib/skylark-all.min",
            // "jquery": "https://cdn.bootcss.com/jquery/2.2.0/jquery.min",
            "jquery": "/lib/skylark-jquery-all.min",
            "countdown": "/lib/countdown",
            clipboard: "libex/clipboard/clipboard",
            html2canvas: "libex/html2canvas/js/html2canvas",
            clippy: "libex/clippy/js/clippy.min",
            bootstrap: "lib/bootstrap/js/bootstrap",
            tether: "lib/tether", // bootstrap need tether
            ripples: "libex/bootstrap-material-design/js/ripples",
            material: "libex/bootstrap-material-design/js/material",
            arrive: "libex/arrive/js/arrive",

            "noext": 'https://cdnjs.cloudflare.com/ajax/libs/requirejs-plugins/1.0.3/noext.min',
            "ityped": "https://unpkg.com/ityped@0.0.5?noext",
            "handlebars": "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.10/handlebars.amd.min",
            "text": "https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text",
            "lodash": "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min"
        },
        shim: {
            "bootstrap": {
                deps: ["jquery"],
                exports: "$"　
            }
        },
        hasCache: {
            "host-node": 1,
            "dom": 0
        },
        packages: [{
            name: "scripts",
            location: "http://ube.ihudao.dt.hudaokeji.com:9900/scripts/user"
        }, {
            name: "markdown",
            location: "lib/markdown"
        }, {
            name: "browserfs",
            main: "browserfs",
            location: "lib/browserfs/dist"
        }, {
            name: "ace",
            main: "ace",
            location: "lib/ace"
        }, {
            name: "dojo",
            main: "main.js",
            location: "lib/dojo"
        }, {
            name: "dijit",
            main: "main.js",
            location: "lib/dijit"
        }, {
            name: "dojox",
            main: "main.js",
            location: "lib/dojox"
        }, {
            name: "djquery",
            location: "lib/djquery"
        },  {
            name: "skylark",
            location: "js/skylark/src/skylark"
        }, {
            name: "qface",
            location: "js/qface/src/qface"
        }, {
            name: "qfacex",
            location: "js/qfacex/src/qfacex"
        }, {
            name: "qscript",
            location: "js/qscript/src/qscript"
        }, {
            name: "qscriptx",
            location: "js/qscriptx/src/qscriptx"
        }, {
            name: "requirejs",
            location: "lib/requirejs"
        }, {
            name: "ufe",
            main: "main.js",
            location: "js/ufe"
        }, {
            name: "ufe-all",
            main: "ufe-all.js",
            location: "js"
        }, {
            name: "resources",
            location: "resources"
        }, {
            name: "utilhub",
            location: "js/utilhub/src/utilhub"
        }, {
            name: "bloom",
            location: "js/utilhub/src/bloom"
        }, {
            name: "wute",
            location: "js/utilhub/src/wute"
        }, {
            name: "udesktop",
            location: "js/udesktop/src/udesktop"
        }, {
            name: 'dbootstrap',
            location: 'lib/dbootstrap'
        }, {
            name: "center",
            location: centerUrl
        }, {
            name: 'headroom',
            location: 'lib/bower_components/headroom.js/dist/headroom.js'
        }, {
            name: "photoSwipe",
            location: "lib/photo-swipe/"
        }, {
            name: "emojify",
            main: "emojify",
            location: "libex/emojify/js"
        }, {
            name: "moment",
            main: "moment-with-locales.min",
            location: "libex/moment/js"
        }, {
            name: "spin",
            main: "spin",
            location: "libex/spin/js"
        }, {
            name: "toastr",
            main: "toastr.min",
            location: "libex/toastr/js"
        }, {
            name: "selectize",
            main: "selectize.min",
            location: "libex/selectize/js/standalone"
        }, {
            name: "d3",
            main: "d3.min",
            location: "libex/d3/js"
        }, {
            name: "atwho",
            main: "jquery.atwho.min",
            location: "libex/jquery.atwho/js"
        }, {
            name: "nanoscroller",
            main: "jquery.nanoscroller.min",
            location: "libex/jquery.nanoscroller/js"
        }, {
            name: 'jquery.ui',
            main: 'jquery-ui.min',
            location: 'lib/jquery-ui'
        }, {
            name: 'jquery.ui.widget',
            main: 'widget',
            location: 'lib/jquery-ui/ui'
        }, {
            name: "caret",
            main: "jquery.caret.min",
            location: "libex/jquery.caret/js"
        }, {
            name: "dropzone",
            main: "dropzone",
            location: "libex/dropzone/js"
        }],
        config: {
            "qscript/system/loader/text": {
                useXhr: function(url, protocol, hostname, port) {
                    return true;
                }
            }

        }
    };

    //var loaderjs = homeUrl + "lib/dojo/dojo.js";
    var loaderjs = homeUrl + "lib/requirejs/require.js";

    var cssboots = [
        homeUrl + "lib/dbootstrap/css/dbootstrap.css",
        // homeUrl + "lib/themes/flat/flat.css",
        homeUrl + "lib/bootstrap/css/bootstrap.css",
        homeUrl + "libex/bootstrap-material-design/css/roboto.css",
        homeUrl + "libex/bootstrap-material-design/css/material.css",
        homeUrl + "libex/bootstrap-material-design/css/ripples.css",
        homeUrl + "libex/ionicons/css/ionicons.css",
        homeUrl + "libex/jquery.atwho/css/jquery.atwho.min.css",
        homeUrl + "libex/dropzone/js/min/dropzone.min.css",
        homeUrl + "libex/toastr/js/toastr.min.css",
        homeUrl + "libex/font-awesome/css/font-awesome.min.css",
        homeUrl + "resources/css/utilhub.min.css"
    ];

    //load requirejs

    for (var i = 0; i < cssboots.length; i++) {
        loadcss(cssboots[i]);
    }

    var boot = function() {
        if (require.config) {
            require.config(config);
        }

        require([
            "tether",
            "dojo",
        ], function(Tether) {
            window.Tether = Tether;
            require([
                "dijit",
                "jquery"
            ], function() {
                require([
                    // "ufe-all"
                    "ufe",
                    //"qface/qface-all",
                    //"qfacex/qfacex-all",
                    //"qscript/qscript-all",
                    //"qscriptx/qscriptx-all",
                    //"utilhub/utilhub-all"
                ], function(ufe) {
                    require([
                        "utilhub/front/system/Runtime",
                        "bootstrap",
                        "ripples",
                        "material",
                        "arrive",
                        "dojo/domReady!"
                    ], function(Runtime, Bootstrap) {
                        var token = document.getElementById("__TOKEN__");
                        var runtime = new Runtime({
                            nodeStarted: nodeStarted,
                            shellId: shellId,
                            apiUrl: apiUrl,
                            token: token ? token.dataset.token : null,
                            bundleSourceMode: bundleSourceMode,
                            centerUrl: centerUrl,
                            debugging: debugging
                        });
                        try {
                            runtime.startup().then(function() {
                                runtime.run();
                                require([
                                    "skylark/noder",
                                    "skylark/scripter",
                                    "skylark/spa",
                                    "scripts/config/config",
                                    "jquery",
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
                                                // var app = window.userApp = new spa.Application(config);
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
                            });
                        } catch (error) {
                            console.log(error);
                            throw error;
                        }
                    });
                });
            });
        });
    };

    loadjs(loaderjs, boot);

})(window);
