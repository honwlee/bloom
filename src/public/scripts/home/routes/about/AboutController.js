define([
    "skylark/spa",
    "skylark/async",
    "skylark/langx",
    "jquery",
    "handlebars",
    "common/partial",
    "skylark/eventer",
    "common/services/server",
    "text!scripts/routes/about/about.html"
], function(spa, async, langx, $, handlebars, partial, eventer, server, aboutTpl) {
    return spa.RouteController.inherit({
        klassName: "AboutController",

        data: null,
        preparing: function(e) {
            var deferred = new async.Deferred(),
                self = this;
            var main = $("#main-wrap")[0],
                throb = window.addThrob(main, function() {
                    server().start().then(function(data) {
                        self.data = data;
                        deferred.resolve();
                        throb.remove();
                        main.style.opacity = 1;
                    });
                });
            e.result = deferred.promise;
        },
        rendering: function(e) {
            e.content = aboutTpl;
        },
        entered: function() {
            var ul = $("<ul>").attr({
                class: "admins"
            }).appendTo($("#contactor"));
            this.data.admins.forEach(function(admin) {
                var user = admin.user,
                    profile = user.profile,
                    l = profile.location;
                partial.get("user-item-partial");
                var tpl = handlebars.compile("<li class='user-item'>{{> user-item-partial}}</li>"),
                    userTpl = tpl({
                        username: user.username,
                        mobile: profile.mobile,
                        email: user.email,
                        avatar: profile.avatar.thumb
                    });
                $(userTpl).appendTo(ul);
            });
        },
        exited: function() {

        }
    });
});
