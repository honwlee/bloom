define([
    "skylark/spa",
    "jquery",
    "skylark/router"
], function(spa, $, router) {
    var currentNav,
        setActive = function(selector) {
            if (currentNav) $(currentNav).removeClass("active");
            currentNav = $(selector);
            if (currentNav) currentNav.addClass("active");
        },
        showThrob = function() {
            var selector = $("#main-wrap"),
                throb = window.addThrob(selector[0], function() {
                    router.one("routed", function() {
                        throb.remove();
                        selector.css("opacity", 1);
                    });
                });
        };
    return spa.PluginController.inherit({
        starting: function(evt) {
            var spa = evt.spa,
                basePath = spa.getConfig("baseUrl"),
                routes = spa.getConfig("routes"),
                _el = $("#sk-navbar");
            var ul = $("<ul>").attr({
                class: "nav navbar-nav"
            }).delegate(".nav-item", "click", function(e) {
                setActive(e.target.parentNode);
            });
            $(".logo-nav").on("click", function() {
                showThrob();
                router.go("");
                setActive(".home-nav");
            });
            router.on("routed", function(e) {
                setActive("." + e._args.current.route.getConfigData("name") + "-nav");
            });
            for (var key in routes) {
                if (key === "home") continue;
                var page = routes[key],
                    name = page.data.name,
                    navName = page.data.navName,
                    path = basePath + page.pathto;
                $("<li>").attr({
                    class: name + "-nav"
                }).on("click", function() {
                    showThrob();
                }).addContent("<a class='nav-item' href='" + path + "'>" + navName + "</a>").appendTo(ul);
            }
            [{
                key: "profile",
                name: "我的主页",
                href: "/users"
            }, {
                key: "logout",
                name: "退出",
                href: "/logout"
            }].forEach(function(item) {
                $("<li>").attr({
                    class: item.key + "-nav"
                }).addContent("<a class='nav-item' data-spa-router='false' href='" + item.href + "'>" + item.name + "</a>").appendTo(ul);
            });
            _el.html(ul);
        },
        routed: function() {}
    });
});
