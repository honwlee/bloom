define([
    "jquery",
    "skylark/langx",
    "./partial",
    "./services/server",
    "handlebars",
    "toastr"
], function($, langx, partial, server, handlebars, toastr) {
    return {
        show: function(contact, dom) {
            partial.get("contact-info-partial");
            partial.get("contact-form-partial");
            var infoTpl = handlebars.compile("{{> contact-info-partial}}"),
                infoModel = $('#contact-info-modal'),
                formModel = $('#contact-form-modal');

            infoModel.modal('show').find(".modal-body").html(infoTpl({ contact: contact }));
            infoModel.find(".del-btn").off("click");
            infoModel.find(".del-btn").on("click", function() {
                infoModel.modal('hide');
                var delModal = $("#_common-confirm-delete");
                delModal.modal('show');
                delModal.find(".btn-cancel").off("click");
                delModal.find(".btn-cancel").on("click", function() {
                    delModal.modal('hide');
                });
                delModal.find(".btn-ok").off("click");
                delModal.on('click', '.btn-ok', function(e) {
                    server().contact("post", "delete", { id: contact.id }).then(function() {
                        toastr.success("已删除！");
                        if (dom) dom.remove();
                        delModal.modal('hide');
                    });
                });

            });
            infoModel.find(".edit-btn").off("click");
            infoModel.find(".edit-btn").on("click", function() {
                infoModel.modal('hide');
                var formTpl = handlebars.compile("{{> contact-form-partial}}");
                formModel.modal('show').find(".modal-body").html(formTpl({ contact: contact }));
                formModel.find(".btn-ok").off("click");
                formModel.find(".btn-ok").on("click", function() {
                    var data = {
                        username: contact.username,
                        id: contact.id
                    };
                    formModel.find(".info-form input").each(function(index, el) {
                        var s = $(el);
                        data[s.attr("name")] = s.val();
                    });
                    server().contact("post", "update", data).then(function(contact) {
                        toastr.success("已保存！");
                        if (dom) {
                            for (var key in data) {
                                dom.find("." + key).html(data[key]);
                            }
                        }
                        formModel.modal('hide');
                    });
                });
            });
        },

        showAddForm: function(callback) {
            var formModel = $('#contact-form-modal');
            partial.get("contact-form-partial");
            var formTpl = handlebars.compile("{{> contact-form-partial}}");
            formModel.modal('show').find(".modal-body").html(formTpl());
            formModel.find(".btn-ok").off("click");
            formModel.find(".btn-ok").on("click", function() {
                var data = {};
                formModel.find(".info-form input").each(function(index, el) {
                    var s = $(el);
                    data[s.attr("name")] = s.val();
                });
                server().contact("post", "update", data).then(function(contact) {
                    toastr.success("已保存！");
                    formModel.modal('hide');
                    callback(contact);
                });
            });
        }
    }
});
