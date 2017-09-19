define([
    "skylark/spa",
    "skylark/langx",
    "jquery",
    "toastr",
    "common/partial",
    "skylark/router",
    "handlebars",
    "common/auth/AuthController"
], function(spa, langx, $, toastr, partial, router,handlebars, authController) {
    var currentNav,
        setActive = function(selector) {
            if (currentNav) $(currentNav).removeClass("active");
            currentNav = $("." + selector + "-nav");
            if (currentNav) currentNav.addClass("active");
        },
        showThrob = function() {
            var selector = $("#main-wrap"),
                throb = window.addThrob(selector[0], function() {
                    router.one("routing", function(e) {
                        window._goTop();
                    });
                    router.one("routed", function() {
                        throb.remove();
                        selector.css("opacity", 1);
                    });
                });
        };
    return spa.PluginController.inherit({
        starting: function(evt) {
            var authFunc = authController();
            authFunc.getNode().appendTo(document.body);
            var spa = evt.spa,
                basePath = spa.getConfig("baseUrl"),
                routes = spa.getConfig("routes"),
                _el = $("#sk-navbar"),
                navClick = function(path, name) {
                    authFunc.hide();
                    var goPath = function() {
                        if (router.go(path, true)) {
                            setActive(name);
                            showThrob();
                        }
                    }

                    if (langx.inArray(name, ["splendid", "contact"]) >= 0) {
                        if ($(".sst").data() && $(".sst").data().status) {
                            goPath();
                        } else {
                            setActive(name);
                            toastr.warning("请先登录！");
                            authFunc.show();
                        }
                    } else {
                        goPath();
                    }
                };
            var ul = $("<ul>").attr({
                class: "nav navbar-nav"
            }).delegate(".nav-item", "click", function(e) {
                var target = $(e.target),
                    data = target.data();
                if (data.spaRouter == false) return;
                navClick(data.path, data.name);
            });
            var selector = $("#main-wrap");
            router.one("prepared", function(e) {
                var curR = e._args.route;
                setActive(curR.name);
            });
            $(".logo-nav").on("click", function() {
                navClick("/", "home");
            });
            for (var key in routes) {
                if (key === "home") continue;
                var page = routes[key],
                    name = page.data.name,
                    navName = page.data.navName,
                    path = page.pathto;
                $("<li>").attr({
                    class: name + "-nav"
                }).html(
                    $("<a>").attr({
                        class: "nav-item"
                    }).data({
                        name: name,
                        path: path
                    }).html(navName)
                ).appendTo(ul);
            }

            [{
                key: "signin",
                name: "登录",
            }].forEach(function(item) {
                $("<li>").attr({
                    class: item.key + "-nav"
                }).html("<a class='nav-item' data-spa-router='false'>" + item.name + "</a>").on("click", function(e) {
                    authFunc.show();
                    setActive("signin");
                }).appendTo(ul);
            });
            _el.html(ul);
            partial.get("gallery-partial");
            var div = $("<div>").html(handlebars.compile("{{> gallery-partial}}")({}));
            document.body.appendChild(div[0].firstChild);
        },
        routed: function() {}
    });
});
