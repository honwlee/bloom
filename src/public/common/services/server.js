define([
    "jquery",
    "skylark/spa",
    "skylark/async",
    "skylark/langx"
], function($, spa, async, langx) {
    var Service = langx.klass({
        klassName: "SpaService",
        memory: {},
        init: function(config) {
            this.memory = {
                data: {},
                user: {},
                contact: {},
                event: {},
                group: {}
            };
        },

        start: function(callback) {
            if (this.memory.data) {
                return async.Deferred.when(this.memory.data);
            } else {
                var deferred = new async.Deferred(),
                    self = this,
                    backendApi = spa().getConfig("backendApi"),
                    tokenApi = spa().getConfig("tokenApi");
                // $.get(tokenApi, function(token) {
                // $.get(backendApi + "?private_token=" + token.token, function(data) {
                $.get(backendApi, function(data) {
                    self.memory.data = data;
                    deferred.resolve(data);
                    // });
                });
                return deferred.promise;
            }
        },

        startServer: function() {
            var deferred = new async.Deferred();
            $.get("/api/start", function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        },

        user: function(method, action, args) {
            // if (method == "get" && this.memory.user[action]) {
            //     return async.Deferred.when(this.memory.user[action]);
            // } else {
            var deferred = new async.Deferred(),
                self = this;
            if (args) {
                $[method]("/api/users/" + action, args, function(data) {
                    self.memory.user[action] = data;
                    deferred.resolve(data);
                });
            } else {
                $[method]("/api/users/" + action, function(data) {
                    self.memory.user[action] = data;
                    deferred.resolve(data);
                });
            }
            return deferred.promise;
            // }
        },

        contact: function(method, action, args) {
            // if (method == "get" && this.memory.user[action]) {
            //     return async.Deferred.when(this.memory.user[action]);
            // } else {
            var deferred = new async.Deferred(),
                self = this;
            if (args) {
                $[method]("/api/contacts/" + action, args, function(data) {
                    self.memory.contact[action] = data;
                    deferred.resolve(data);
                });
            } else {
                $[method]("/api/contacts/" + action, function(data) {
                    self.memory.contact[action] = data;
                    deferred.resolve(data);
                });
            }
            return deferred.promise;
            // }
        },

        event: function(method, action, args) {
            // if (method == "get" && this.memory.user[action]) {
            //     return async.Deferred.when(this.memory.user[action]);
            // } else {
            var deferred = new async.Deferred(),
                self = this;
            if (args) {
                $[method]("/api/events/" + action, args, function(data) {
                    self.memory.event[action] = data;
                    deferred.resolve(data);
                });
            } else {
                $[method]("/api/events/" + action, function(data) {
                    self.memory.event[action] = data;
                    deferred.resolve(data);
                });
            }
            return deferred.promise;
            // }
        },

        group: function(method, action, args) {
            // if (method == "get" && this.memory.user[action]) {
            //     return async.Deferred.when(this.memory.user[action]);
            // } else {
            var deferred = new async.Deferred(),
                self = this;
            if (args) {
                $[method]("/api/groups/" + action, args, function(data) {
                    self.memory.group[action] = data;
                    deferred.resolve(data);
                });
            } else {
                $[method]("/api/groups/" + action, function(data) {
                    self.memory.group[action] = data;
                    deferred.resolve(data);
                });
            }
            return deferred.promise;
            // }
        }

    });

    var server;
    var serverFunc = function(config) {
        if (!server) {
            window.spaServer = server = new Service(config);
        }
        return server;
    }
    return serverFunc;
});
