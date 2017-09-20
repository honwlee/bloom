define([
    "skylark/spa",
    "skylark/async",
    "skylark/langx",
    "jquery",
    "handlebars",
    "skylark/eventer",
    "common/contactModal",
    "common/services/server",
    "common/ProfileColorSetting",
    "text!scripts/routes/home/home.handlebars",
    "common/photoSwipe",
    "toastr"
], function(spa, async, langx, $, handlebars, eventer, contactModal, server, ProfileColorSetting, homeTpl, photoSwipe, toastr) {
    var currentPanel, currentIcon;
    return spa.RouteController.inherit({
        klassName: "HomeController",
        contacts: null,
        events: null,
        group: null,
        preparing: function(e) {
            var defer = new async.Deferred(),
                self = this;
            var main = $("#main-wrap")[0],
                throb = window.addThrob(main, function() {
                    server().startServer().then(function(data) {
                        self.contacts = data.contacts;
                        self.events = data.events;
                        self.group = data.group;
                        self.users = data.users;
                        throb.remove();
                        main.style.opacity = 1;
                        defer.resolve();
                    });
                });
            e.result = defer.promise;
        },

        rendering: function(e) {
            var self = this,
                selector = $(langx.trim(homeTpl));
            handlebars.registerPartial("home-user-list-partial", langx.trim(selector.find("#home-user-list-partial").html()).replace(/\{\{&gt;/g, "{{>"));
            handlebars.registerPartial("home-event-list-partial", langx.trim(selector.find("#home-event-list-partial").html()).replace(/\{\{&gt;/g, "{{>"));
            handlebars.registerPartial("home-group-info-partial", langx.trim(selector.find("#home-group-info-partial").html()).replace(/\{\{&gt;/g, "{{>"));
            handlebars.registerPartial("home-actions-partial", langx.trim(selector.find("#home-actions-partial").html()).replace(/\{\{&gt;/g, "{{>"));
            handlebars.registerPartial("home-event-item-partial", langx.trim(selector.find("#home-event-item-partial").html()).replace(/\{\{&gt;/g, "{{>"));
            handlebars.registerPartial("home-event-form-partial", langx.trim(selector.find("#home-event-form-partial").html()).replace(/\{\{&gt;/g, "{{>"));
            handlebars.registerPartial("home-user-config-item-partial", langx.trim(selector.find("#home-user-config-item-partial").html()).replace(/\{\{&gt;/g, "{{>"));
            handlebars.registerPartial("home-user-config-partial", langx.trim(selector.find("#home-user-config-partial").html()).replace(/\{\{&gt;/g, "{{>"));
            var tpl = handlebars.compile(langx.trim(selector.find("#home-main").html()).replace("{{&gt;", "{{>"));
            var actions = [{
                name: 'profile',
                title: '成员列表',
                icon: 'fa-user-circle',
                data: {

                }
            }, {
                name: 'photos',
                title: '精彩图片',
                icon: 'fa-photo',
                data: {

                }
            }, {
                name: 'events',
                title: '行程表',
                icon: 'fa-calendar',
                data: {

                }
            }, {
                name: 'logo',
                title: '班级logo',
                icon: 'fa-star-o',
                data: {

                }
            }];
            if (window.currentUser.isAdmin) {
                actions.push({
                    name: 'setting',
                    title: '设置',
                    icon: 'fa-pencil-square-o',
                    data: {

                    }
                })
            }
            e.content = $(tpl({
                members: this.contacts,
                group: this.group,
                actions: actions,
                users: this.users,
                user: window.currentUser,
                events: this.events
            }));

            e.content.find(".icons").delegate(".action-item", "click", function(e) {
                var name = $(e.target).data().name;
                if (currentIcon) currentIcon.removeClass("active");
                $(e.target).addClass("active");
                currentIcon = $(e.target);
                if (currentPanel) currentPanel.addClass("hide");
                currentPanel = $(".panel-item." + name).removeClass("hide");
            });
            currentPanel = e.content.find(".panel-item.photos").removeClass("hide");
            currentIcon = e.content.find(".icons .photos").addClass("active");
            var ps = new photoSwipe({
                photoData: []
            });
            var eC = e.content,
                psTpl = ps.start();
            $(psTpl).appendTo(eC.find(".photoSwipeContainer"));
            this._initProfileSetting(eC, window.currentUser.isAdmin);
            this._bindEventsAction(eC);
            this._bindUserConfig(eC);
            this._bindMember(eC);
            if (window.currentUser.isAdmin) {
                eC.find(".panel").find(".refresh-btn").removeClass("hide");
                eC.find(".panel").delegate(".refresh-btn", "click", function(e) {
                    var data = $(e.currentTarget).data();
                    self[data.action](selector, $("." + data.parent + " .list-content"));
                });
            }
        },

        _refreshEvents: function(selector, container) {
            server().event("get", "index").then(function(events) {
                var tpl = handlebars.compile("{{> home-event-list-partial}}");
                container.empty().html(tpl({ events: events, user: window.currentUser }));
            });
        },

        _refreshUsers: function(selector, container) {
            server().user("get", "index").then(function(users) {
                var tpl = handlebars.compile("{{> home-user-list-partial}}");
                container.empty().html(tpl({ users: users }));
            });
        },

        _bindMember: function(eC) {
            eC.find(".members-list").delegate("li", "click", function(e) {
                var id = $(e.currentTarget).data().mid;
                server().contact("get", "show?id=" + id).then(function(contact) {
                    contactModal.show(contact);
                });
            });
        },

        _bindUserConfig: function(eC) {
            var self = this;
            eC.find(".user-setting").delegate(".u-config-item", "click", function(e) {
                var data = $(e.currentTarget).data();
                if (data.action) self[data.action](data.uid);
            });
            eC.find('#confirm-forbidden').on('click', '.btn-ok', function(e) {
                var $modalDiv = $(e.delegateTarget),
                    target = $(this);
                var id = target.data('uid');
                $modalDiv.addClass('loading');
                self.setUnActiviated(id).then(function() {
                    $modalDiv.modal('hide').removeClass('loading');
                });
            });
            eC.find('#confirm-forbidden').on('show.bs.modal', function(e) {
                var data = $(e.relatedTarget).data();
                eC.find('.btn-ok', this).data('uid', data.uid);
            });
            eC.find('#confirm-initPassword').on('click', '.btn-ok', function(e) {
                var $modalDiv = $(e.delegateTarget),
                    target = $(this);
                var id = target.data('uid');
                $modalDiv.addClass('loading');
                self.setPassword(id).then(function() {
                    $modalDiv.modal('hide').removeClass('loading');
                });
            });
            eC.find('#confirm-initPassword').on('show.bs.modal', function(e) {
                var data = $(e.relatedTarget).data();
                eC.find('.btn-ok', this).data('uid', data.uid);
            });
        },

        _bindEventsAction: function(eC) {
            var self = this;
            if (!window.currentUser.isAdmin) return;
            eC.find(".events__content .actions").removeClass("hide");
            eC.find(".events-panel .add-btn").removeClass("hide");

            eC.find('#edit-modal').on('click', '.btn-ok', function(e) {
                var $modalDiv = $(e.delegateTarget),
                    target = $(this);
                var id = target.data('evtId');

                $modalDiv.addClass('loading');
                self._saveEvent(id).then(function(evt) {
                    $modalDiv.modal('hide').removeClass('loading');
                    if (id) {
                        toastr.success("已编辑！");
                        $("#event_" + id + " .event-description").html(evt.title);
                        $("#event_" + id + " .event-hour").html(evt.time);
                    } else {
                        toastr.success("已添加！");
                        var tpl = handlebars.compile("{{> home-event-item-partial}}");
                        $(tpl(evt)).appendTo($(".events-panel")).find(".actions").removeClass("hide");
                    }
                });
            });
            eC.find('#edit-modal').on('show.bs.modal', function(e) {
                var tpl, data = $(e.relatedTarget).data();
                if (id = data.evtId) {
                    server().event("get", "show?id=" + id).then(function(data) {
                        tpl = handlebars.compile("{{> home-event-form-partial}}");
                        data.header = "编辑";
                        eC.find("#edit-modal .modal-body").html(tpl(data));
                    });
                    eC.find('.btn-ok', this).data('evtId', id);
                } else {
                    tpl = handlebars.compile("{{> home-event-form-partial}}");
                    eC.find("#edit-modal .modal-body").html(tpl({
                        header: "添加"
                    }));
                }
            });

            eC.find('#confirm-delete').on('click', '.btn-ok', function(e) {
                var $modalDiv = $(e.delegateTarget),
                    target = $(this);
                var id = target.data('evtId');

                $modalDiv.addClass('loading');
                server().event("post", "delete", { id: id }).then(function() {
                    $modalDiv.modal('hide').removeClass('loading');
                    toastr.success("已删除！");
                    $("#event_" + id).remove();
                });
            });
            eC.find('#confirm-delete').on('show.bs.modal', function(e) {
                var data = $(e.relatedTarget).data();
                eC.find('.btn-ok', this).data('evtId', data.evtId);
            });
        },

        setPassword: function(id) {
            return server().user("post", "update", {
                id: id,
                _action: "password"
            }).then(function(user) {
                toastr.success("用户:" + user.display + "的密码初始化成功！");
            });
        },

        setActiviated: function(id) {
            server().user("post", "update", {
                id: id,
                _action: "active"
            }).then(function(user) {
                toastr.success("用户:" + user.display + "激活成功！");
                tpl = handlebars.compile("{{> home-user-config-item-partial isSuper=" + window.currentUser.isSuperAdmin + "}}");
                $("#user_" + id).empty().html(tpl(user));
            });
        },

        setUnActiviated: function(id) {
            return server().user("post", "update", {
                id: id,
                _action: "unActive"
            }).then(function(user) {
                toastr.success("用户:" + user.display + "禁止成功！");
                tpl = handlebars.compile("{{> home-user-config-item-partial isSuper=" + window.currentUser.isSuperAdmin + "}}");
                $("#user_" + id).empty().html(tpl(user));
            });
        },

        setNormal: function(id) {
            server().user("post", "update", {
                id: id,
                _action: "role-normal"
            }).then(function(user) {
                toastr.success("用户:" + user.display + "已降为普通成员！");
                tpl = handlebars.compile("{{> home-user-config-item-partial isSuper=" + window.currentUser.isSuperAdmin + "}}");
                $("#user_" + id).empty().html(tpl(user));
            });
        },

        setAdmin: function(id) {
            server().user("post", "update", {
                id: id,
                _action: "role-admin"
            }).then(function(user) {
                toastr.success("用户:" + user.display + "已提升为管理员！");
                tpl = handlebars.compile("{{> home-user-config-item-partial isSuper=" + window.currentUser.isSuperAdmin + "}}");
                $("#user_" + id).empty().html(tpl(user));
            });
        },

        _initProfileSetting: function(selector, admin) {
            var self = this,
                pcs = new ProfileColorSetting({
                    colorType: "bubble",
                    colorOptions: {
                        color: this.group.color,
                        bgSelector: selector.find(".header")
                    }
                }),
                _setting = selector.find("#setting")
            $(pcs.start()).appendTo(_setting.find(".color-setting .content"));

            if (admin) _setting.delegate(".save-btn", "click", function(e) {
                switch ($(e.target).data().action) {
                    case "color":
                        self._saveColor(pcs.getColor());
                        break;
                    case "info":
                        self._saveInfo();
                        break;
                }
            });
        },

        _saveEvent: function(id) {
            var method, data = { id: id };
            if (id) {
                method = "update";
                data.id = id;
            } else {
                method = "create";
            }
            $(".event-form input").each(function(index, el) {
                var s = $(el);
                data[s.attr("name")] = s.val();
            });
            data.description = $(".event-form textarea").text();
            return server().event("post", method, data);
        },

        _saveInfo: function() {
            var data = {
                id: this.group.id
            };
            $(".profile-form input").each(function(index, el) {
                var s = $(el);
                data[s.attr("name")] = s.val();
            });
            data.description = $(".profile-form textarea").text();
            server().group("post", "update", data).then(function(group) {
                tpl = handlebars.compile("{{> home-group-info-partial}}");
                $(".header-item__img").empty().html(tpl({ group: group }));
                toastr.success("已保存！");
            });
        },

        _saveColor: function(color) {
            server().group("post", "update", {
                id: this.group.id,
                color: color
            }).then(function() {
                toastr.success("已保存！");
            });
        },

        entered: function() {

        },
        exited: function() {

        }
    });
});
