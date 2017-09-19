define([
    "skylark/spa",
    "skylark/async",
    "skylark/langx",
    "jquery",
    "handlebars",
    "skylark/eventer",
    "common/services/server",
    "common/ProfileColorSetting",
    "text!scripts/routes/profile/profile.handlebars",
    "text!data/contacts.json",
    "common/photoSwipe",
    "common/PhotoCrop",
    "toastr"
], function(spa, async, langx, $, handlebars, eventer, server, ProfileColorSetting, profileTpl, contactsJson,
    photoSwipe, PhotoCrop, toastr) {
    var currentPanel, currentIcon;

    return spa.RouteController.inherit({
        klassName: "HomeController",
        user: null,
        avatarData: null,
        // preparing: function(e) {
        //     var deferred = new async.Deferred(),
        //         self = this;
        //     var main = $("#main-wrap")[0],
        //         throb = window.addThrob(main, function() {
        //             server().user("get", "show").then(function(user) {
        //                 self.user = user;
        //                 deferred.resolve();
        //                 throb.remove();
        //                 main.style.opacity = 1;
        //             });
        //         });
        //     e.result = deferred.promise;
        // },

        rendering: function(e) {
            var selector = $(langx.trim(profileTpl)),
                user = this.user = spa().currentUser;
            handlebars.registerPartial("profile-form-partial", langx.trim(selector.find("#profile-form-partial").html()).replace(/\{\{&gt;/g, "{{>"));
            var tpl = handlebars.compile(langx.trim(selector.find("#profile-main").html()).replace("{{&gt;", "{{>"));
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
                }, {
                    name: 'setting',
                    title: '设置',
                    icon: 'fa-pencil-square-o',
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

            this._initProfileSetting(e.content)
        },

        _initProfileSetting: function(selector) {
            var self = this,
                pcs = new ProfileColorSetting({
                    colorType: "bubble",
                    colorOptions: {
                        color: this.user.color,
                        bgSelector: selector.find(".header")
                    }
                }),
                _setting = selector.find("#setting")
            $(pcs.start()).appendTo(_setting.find(".color-setting .content"));
            var crop = new PhotoCrop(_setting.find(".avatar-setting .content"));
            crop.start();

            _setting.delegate(".save-btn", "click", function(e) {
                switch ($(e.target).data().action) {
                    case "color":
                        self._saveColor(pcs.getColor());
                        break;
                    case "info":
                        self._saveInfo();
                        break;
                    case "avatar":
                        var img = _setting.find(".js-image-preview img");
                        if (img && img.attr("src")) {
                            self._saveAvatar(img.attr("src"));
                        } else {
                            toastr.error("请选择图片，并进行裁剪");
                        }
                        break;
                    case "password":
                        self._updatePassword(e);
                        break;
                }
            });
        },

        _updatePassword: function(e) {
            var passwordDom = $(e.target).parent().find("input.password");
            server().user("post", "update", {
                id: this.user.id,
                _action: "password",
                password: passwordDom.val()
            }).then(function() {
                passwordDom.val("");
                toastr.success("密码更改成功！");
            });
        },

        _saveAvatar: function(data) {
            server().contact("post", "update", {
                id: this.user.contact.id,
                avatar: data
            }).then(function() {
                $(".header-item__img .default-avatar img").attr("src", data);
                toastr.success("已保存！");
            });
        },

        _saveInfo: function() {
            var data = {
                id: this.user.contact.id
            };
            $(".info-form input").each(function(index, el) {
                var s = $(el);
                data[s.attr("name")] = s.val();
            });
            server().contact("post", "update", data).then(function() {
                toastr.success("已保存！");
            });
        },

        _saveColor: function(color) {
            server().user("post", "update", {
                username: this.user.username,
                color: color
            }).then(function() {
                toastr.success("已保存！");
            });
        },

        entered: function() {},
        exited: function() {

        }
    });
});
