define([
    "skylark/spa",
    "skylark/langx",
    "jquery",
    "toastr",
    "common/partial",
    "skylark/router",
    "handlebars"
], function(spa, langx, $, toastr, partial, router, handlebars) {
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
            var spa = evt.spa,
                basePath = spa.getConfig("baseUrl"),
                routes = spa.getConfig("routes"),
                _el = $("#sk-navbar"),
                navClick = function(path, name) {
                    var goPath = function() {
                        if (router.go(path, true)) {
                            setActive(name);
                            showThrob();
                        }
                    }
                    goPath();
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
                key: "logout",
                name: "退出",
            }].forEach(function(item) {
                $("<li>").attr({
                    class: item.key + "-nav"
                }).html("<a class='nav-item' data-spa-router='false' href='/logout'>" + item.name + "</a>").appendTo(ul);
            });
            _el.html(ul);
            partial.get("gallery-partial");
            partial.get("del-confirm-modal-partial");
            partial.get("contact-info-modal-partial");
            partial.get("contact-form-modal-partial");
            var div = $("<div>").html(handlebars.compile("{{> gallery-partial}}")({}));
            var delModal = $("<div>").html(handlebars.compile("{{> del-confirm-modal-partial}}")());
            var infoModal = $("<div>").html(handlebars.compile("{{> contact-info-modal-partial}}")({
                isAdmin: window.currentUser.isAdmin
            }));
            var formModal = $("<div>").html(handlebars.compile("{{> contact-form-modal-partial}}")({
                isAdmin: window.currentUser.isAdmin
            }));
            document.body.appendChild(div[0].firstChild);
            document.body.appendChild(delModal[0].firstChild);
            document.body.appendChild(infoModal[0].firstChild);
            document.body.appendChild(formModal[0].firstChild);

        },
        routed: function() {}
    });
});
