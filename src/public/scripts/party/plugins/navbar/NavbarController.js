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
        currentNav: function() {
            return currentNav;
        },

        showItem: function(name) {
            $("." + name + "-nav").removeClass("hide");
            return this;
        },

        hideItem: function(name) {
            $("." + name + "-nav").addClass("hide");
            return this;
        },

        updateName: function(name, value, isAvatar) {
            if (isAvatar) {
                $(".profile-nav a span").html("<img src='" + value + "'>");
            } else {
                $("." + name + "-nav a").text(value);
            }
            return this;
        },

        starting: function(evt) {
            var spa = evt.spa,
                self = this,
                user = window.currentUser,
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
                var target = $(e.currentTarget),
                    data = target.data();
                if (data.spaRouter == false) return;
                navClick(data.path, data.name);
            });
            var selector = $("#main-wrap");
            router.on("preparing", function(e) {
                var curR = e._args.route;
                self.showItem(curR.name);
            });
            router.one("prepared", function(e) {
                var curR = e._args.route;
                pageInited = true;
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
                    path = page.pathto,
                    className = key === "user" ? name + "-nav hide" : name + "-nav",
                    content = navName;
                if (key === "profile") {
                    info = user.avatar ? "<img src='" + user.avatar + "'>" : "<i></i>";
                    content = "<span class='user-avatar'>" + info + "</span>"
                }
                $("<li>").attr({
                    class: className
                }).html(
                    $("<a>").attr({
                        class: "nav-item"
                    }).data({
                        name: name,
                        path: path
                    }).html(content)
                ).appendTo(ul);
            }
            [{
                key: "logout",
                href: "/logout",
                name: "退出"
            }].forEach(function(item) {
                $("<li>").attr({
                    class: item.key + "-nav"
                }).html("<a class='nav-item' data-spa-router='false' href='" + item.href + "'>" + item.name + "</a>").appendTo(ul);
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
