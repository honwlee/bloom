define([
    "jquery",
    "skylark/langx",
    "./partial",
    "./services/server",
    "handlebars",
    "toastr"
], function($, langx, partial, server, handlebars, toastr) {
    return {
        show: function(contact) {
            partial.get("contact-user-info-partial");
            partial.get("contact-form-info-partial");
            var infoTpl = handlebars.compile("{{> contact-user-info-partial}}"),
                infoModel = $('#contact-info-modal'),
                formModel = $('#contact-form-modal');
            infoModel.modal('show').find(".modal-body").html(infoTpl({ contact: contact }));
            infoModel.find(".btn-edit").on("click", function() {
                infoModel.modal('hide');
                var formTpl = handlebars.compile("{{> contact-form-info-partial}}");
                formModel.modal('show').find(".modal-body").html(formTpl({ contact: contact }));
                formModel.find(".btn-ok").on("click", function() {
                    var data = {
                        username: contact.username,
                        id: contact.id
                    };
                    $(".info-form input").each(function(index, el) {
                        var s = $(el);
                        data[s.attr("name")] = s.val();
                    });
                    server().contact("post", "update", data).then(function() {
                        toastr.success("已保存！");
                        formModel.modal('hide')
                    });
                });
            });
        }
    }
});
