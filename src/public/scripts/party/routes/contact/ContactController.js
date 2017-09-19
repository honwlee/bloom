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
                        sortName: "username",
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
