define([
    "skylark/spa",
    "skylark/async",
    "skylark/langx",
    "jquery",
    "handlebars",
    "common/partial",
    "skylark/eventer",
    "common/services/server",
    "text!scripts/routes/splendid/splendid.html"
], function(spa, async, langx, $, handlebars, partial, eventer, server, splendidTpl) {
    return spa.RouteController.inherit({
        klassName: "SplendidController",

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
            e.content = splendidTpl;
        },
        entered: function() {
            // this.data.posts.forEach(function(post) {
            //     partial.get("post-item-partial");
            //     var content = "";
            //     $("<div>").html(post.html).children().slice(0, 3).each(function(index, el) {
            //         content += (el.innerHTML + "<br>");
            //     });
            //     var tpl = handlebars.compile("<div class='col-sm-6 col-md-4 post-item'>{{> post-item-partial}}</div>"),
            //         postTpl = tpl({
            //             title: post.title,
            //             content: content,
            //             imgSrc: ""
            //         });
            //     $(postTpl).appendTo($("#postsContainer"));
            // });
            // $("#postsContainer").delegate(".blog-preview-btn", "click", function() {
            //     spa.showPopPage($("<div>").html("test"));
            // });
        },
        exited: function() {

        }
    });
});
