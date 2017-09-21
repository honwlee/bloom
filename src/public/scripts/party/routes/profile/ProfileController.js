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
        rendering: function(e) {
            var selector = $(langx.trim(profileTpl)),
                user = this.user = window.currentUser;
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
                var promise = new async.Deferred.when(0);
                var $this = $(this);
                $this.button('loading');
                switch ($(e.target).data().action) {
                    case "color":
                        promise = self._saveColor(pcs.getColor());
                        break;
                    case "info":
                        promise = self._saveInfo();
                        break;
                    case "avatar":
                        var img = _setting.find(".js-image-preview img");
                        if (img && img.attr("src")) {
                            promise = self._saveAvatar(img.attr("src"));
                        } else {
                            toastr.error("请选择图片，并进行裁剪");
                        }
                        break;
                    case "password":
                        promise = self._updatePassword(e);
                        break;
                }
                promise.then(function() {
                    $this.button('reset');
                });
            });
        },

        _updatePassword: function(e) {
            var passwordDom = $(e.target).parent().find("input.password");
            return server().connect("user", "post", "update", {
                id: this.user.id,
                _action: "password",
                password: passwordDom.val()
            }).then(function() {
                passwordDom.val("");
                toastr.success("密码更改成功！");
            });
        },

        _saveAvatar: function(avatar) {
            var params = {
                username: this.user.display,
                avatar: avatar
            };
            if (this.user) {
                params.id = this.user.id;
            }
            return server().connect("user", "post", "update", params).then(function() {
                var navCtrl = spa().getPlugin("navbar").controller;
                $(".header-item__img .default-avatar img").attr("src", avatar);
                navCtrl.updateName('profile', avatar, true);
                toastr.success("已保存！");
            });
        },

        _saveInfo: function() {
            var data = {
                username: this.user.display
            };
            if (this.user.contact) {
                data.id = this.user.contact.id;
            }
            $(".info-form input").each(function(index, el) {
                var s = $(el);
                data[s.attr("name")] = s.val();
            });
            return server().connect("contact", "post", "update", data).then(function() {
                toastr.success("已保存！");
            });
        },

        _saveColor: function(color) {
            return server().connect("user", "post", "update", {
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
