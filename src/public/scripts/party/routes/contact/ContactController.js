define([
    "skylark/spa",
    "skylark/async",
    "skylark/langx",
    "jquery",
    "skylark/eventer",
    "common/services/server",
    "text!scripts/routes/contact/contact.html",
    "bootstrap-table"
], function(spa, async, langx, $, eventer, server, contactTpl) {
    return spa.RouteController.inherit({
        klassName: "ContactController",
        contacts: null,
        preparing: function(e) {
            var deferred = new async.Deferred(),
                self = this;
            var main = $("#main-wrap")[0],
                throb = window.addThrob(main, function() {
                    server().contact("get", "index").then(function(data) {
                        self.contacts = data;
                        deferred.resolve();
                        throb.remove();
                        main.style.opacity = 1;
                    });
                });
            e.result = deferred.promise;
        },
        rendering: function(e) {
            e.content = contactTpl;
        },

        entered: function() {
            var self = this;
            require([
                "bootstrap-table-zh-CN",
                "tableExport",
                "bt-export",
                "bt-mobile",
                "bt-cookie"
            ], function() {

                function showAndSave(data) {
                    var method, url = "/api/contacts";
                    if (data) {
                        method = "PUT";
                        url = url + "/" + data.id;
                        ["busNum", "time", "username", "mobile"].forEach(function(key) {
                            $("#" + key).val(data[key]);
                        });
                    } else {
                        method = "POST";
                        ["busNum", "time", "username", "mobile"].forEach(function(key) {
                            $("#" + key).val("");
                        });
                    }
                    $("#formModal").modal('show');
                    $("#saveContact").off("click");
                    $("#saveContact").on("click", function() {
                        $.ajax({
                            type: method,
                            url: url,
                            data: {
                                busNum: $("#busNum").val(),
                                time: $("#time").val(),
                                username: $("#username").val(),
                                mobile: $("#mobile").val()
                            }
                        }).done(function(cbData) {
                            if (data) {
                                $('#contactList').bootstrapTable('remove', {
                                    field: 'id',
                                    values: [data.id]
                                });
                            }
                            $('#contactList').bootstrapTable('prepend', [cbData]);
                            // $('#contactList').bootstrapTable('refresh');
                            $("#formModal").modal('hide');
                        });
                    });
                };

                // table item format
                function operateFormatter(value, row, index) {
                    return [
                        '<a class="edit" href="javascript:void(0)" title="编辑">',
                        '<i class="glyphicon glyphicon-edit"></i>',
                        '</a>  ',
                        '<a class="remove" href="javascript:void(0)" title="删除">',
                        '<i class="glyphicon glyphicon-remove"></i>',
                        '</a>'
                    ].join('');
                };

                function imageFormatter(data) {
                    return "<img class='mini-avatar' src='" + data + "'>";
                }

                function totalTextFormatter(data) {
                    return data;
                }

                // table event
                window.operateEvents = {
                    'click .edit': function(e, value, row, index) {
                        editContact(row.id);
                    },
                    'click .remove': function(e, value, row, index) {
                        $('#confirm').modal({
                            backdrop: 'static',
                            keyboard: false
                        }).off('click', '#delete');
                        $('#confirm').modal({
                            backdrop: 'static',
                            keyboard: false
                        }).on('click', '#delete', function(e) {
                            removeContact(row.id, function() {
                                $('#contactList').bootstrapTable('remove', {
                                    field: 'id',
                                    values: [row.id]
                                });
                            });
                        });
                    }
                };

                // edit contact
                function editContact(id) {
                    $.ajax({
                        type: "GET",
                        url: "/api/contacts/" + id,
                    }).done(function(data) {
                        showAndSave(data);
                    });
                };

                // remove contact
                function removeContact(id, callback) {
                    $.ajax({
                        type: "DELETE",
                        url: "/api/contacts/" + id,
                    }).done(function() {
                        callback.call();
                    });
                };

                function initTable() {
                    // fill list
                    var columns = [{
                        field: 'username',
                        title: '姓名',
                        sortable: true,
                        align: 'center',
                        formatter: totalTextFormatter
                    }, {
                        field: 'address',
                        title: '地址',
                        sortable: true,
                        align: 'center',
                        formatter: totalTextFormatter
                    }, {
                        field: 'job',
                        title: '工作单位',
                        sortable: true,
                        align: 'center',
                        formatter: totalTextFormatter
                    }, {
                        field: 'jobAddress',
                        title: '工作地点',
                        sortable: true,
                        align: 'center',
                        formatter: totalTextFormatter
                    }, {
                        field: 'birthday',
                        title: '生日',
                        sortable: true,
                        align: 'center',
                        formatter: totalTextFormatter
                    }, {
                        field: 'mobile',
                        title: '联系电话',
                        sortable: true,
                        align: 'center',
                        formatter: totalTextFormatter
                    }, {
                        field: 'status',
                        title: '备注',
                        sortable: true,
                        align: 'center',
                        formatter: totalTextFormatter
                    }];
                    if ($("#__username__").text()) {
                        columns.push({
                            field: 'operate',
                            title: '操作',
                            align: 'center',
                            events: operateEvents,
                            formatter: operateFormatter
                        });
                    }
                    var items = [];
                    self.contacts.forEach(function(member) {
                        items.push({
                            username: member.username,
                            birthday: member.birthday,
                            address: member.address,
                            job: member.job,
                            mobile: member.mobile,
                            jobAddress: member.jobAddress,
                            status: member.status
                        });
                    });
                    $('#contactList').bootstrapTable({
                        responseHandler: function(res) {
                            return res;
                        },
                        sortName: "id",
                        sortOrder: "desc",
                        columns: columns,
                        data: items
                    });
                };

                initTable();
            });
        },
        exited: function() {

        }
    });
});
