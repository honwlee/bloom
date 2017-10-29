define([
    "skylark/spa",
    "skylark/async",
    "skylark/langx",
    "jquery",
    "skylark/eventer",
    "common/services/server",
    "scripts/routes/game/lib/MemoryGame",
    "text!scripts/routes/game/game.html"
], function(spa, async, langx, $, eventer, server, MemoryGame, gameTpl) {
    return spa.RouteController.inherit({
        klassName: "GameController",
        rendering: function(e) {
            e.content = gameTpl;
        },

        rendered: function() {
            var cards = [];
            for (var i = 1; i < 33; i++) {
                (function(_i) {
                    cards.push({
                        name: "img" + _i,
                        img: "assets/images/pictures/change/img" + _i + ".JPG",
                        id: _i
                    });
                })(i)
            }
            var game = new MemoryGame({
                container: "#gameContainer",
                outSrc: "assets/images/pictures/change/cover.JPG",
                cards: cards
            });
            game.on("gameEnded", function(e) {
                $("#endModal").modal('show').find(".modal-body").html(e.data.tpl);
                $("#endModal").find("#mg__onend--restart").on("click", function() {
                    $("#endModal").modal('hide');
                });

            });
        },

        entered: function() {},
        exited: function() {}
    });
});
