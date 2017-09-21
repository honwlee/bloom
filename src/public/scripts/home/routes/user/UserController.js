define([
    "skylark/spa",
    "skylark/async",
    "skylark/langx",
    "jquery",
    "handlebars",
    "skylark/eventer",
    "common/services/server",
    "common/ProfileColorSetting",
    "text!scripts/routes/user/user.handlebars",
    "text!data/contacts.json",
    "common/photoSwipe",
    "common/PhotoCrop",
    "toastr"
], function(spa, async, langx, $, handlebars, eventer, server, ProfileColorSetting, profileTpl, contactsJson,
    photoSwipe, PhotoCrop, toastr) {
    var currentPanel, currentIcon, uname;
    return spa.RouteController.inherit({
        klassName: "HomeController",
        user: null,
        preparing: function(e) {
            uname = window.location.pathname.match(/\/([^\/]*)$/)[1];
            var navCtrl = spa().getPlugin("navbar").controller;
            var deferred = new async.Deferred(),
                self = this;
            var main = $("#main-wrap")[0],
                throb = window.addThrob(main, function() {
                    server().user("get", "show?uname=" + uname).then(function(data) {
                        if (data.status) {
                            self.user = data.user;
                            navCtrl.updateName('user', uname);
                        } else {

                        }
                        deferred.resolve();
                        throb.remove();
                        main.style.opacity = 1;
                    });
                });
            e.result = deferred.promise;
        },
        rendering: function(e) {
            var tpl,
                selector = $(langx.trim(profileTpl)),
                user = this.user;
            if (user) {
                handlebars.registerPartial("profile-form-partial", langx.trim(selector.find("#profile-form-partial").html()).replace(/\{\{&gt;/g, "{{>"));
                tpl = handlebars.compile(langx.trim(selector.find("#profile-main").html()).replace("{{&gt;", "{{>"));
                e.content = $(tpl({
                    user: user,
                    contact: user.contact,
                    actions: [{
                        name: 'profile',
                        title: '详细信息',
                        icon: 'fa-user-circle',
                        data: {

                        }
                    }, {
                        name: 'posts',
                        title: '精彩博客',
                        icon: 'fa-list',
                        data: {

                        }
                    }]
                }));
                e.content.find(".icons").delegate(".action-item", "click", function(e) {
                    var name = $(e.target).data().name;
                    if (currentIcon) currentIcon.removeClass("active");
                    $(e.target).addClass("active");
                    currentIcon = $(e.target);
                    if (currentPanel) currentPanel.addClass("hide");
                    currentPanel = $(".panel-item." + name).removeClass("hide");
                });
                currentPanel = e.content.find(".panel-item.posts").removeClass("hide");
                currentIcon = e.content.find(".icons .posts").addClass("active");
                // var ps = new photoSwipe({
                //     photoData: []
                // });
                // var psTpl = ps.start();
                // $(psTpl).appendTo(e.content.find(".photoSwipeContainer"));
            } else {
                handlebars.registerPartial("user-not-found-partial", langx.trim(selector.find("#user-not-found-partial").html()).replace(/\{\{&gt;/g, "{{>"));
                tpl = handlebars.compile("{{> user-not-found-partial}}");
                e.content = $(tpl({
                    uname: uname
                }));
            }
        },

        entered: function() {},
        exited: function() {

        }
    });
});
