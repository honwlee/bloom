define([
    "skylark-jquery",
    "skylark/langx",
    "text!scripts/routes/game/lib/memoryGame.html"
], function($$, langx, tpl) {
    function shuffle(o) {
        for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };

    function createEvent(type, props) {
        var e = new CustomEvent(type, props);
        return langx.safeMixin(e, props);
    };
    var __selector = $(langx.trim(tpl));

    function __findTpl(id) {
        return langx.trim(__selector.find("#" + id).html());
    };
    var __mainTpl = __findTpl("main"),
        __cardTpl = __findTpl("cardItem"),
        __endTpl = __findTpl("end");
    return langx.Evented.inherit({
        klassName: "MemoryGame",
        gameState: 1,
        card1: "",
        card2: "",
        card1id: "",
        card2id: "",
        card1flipped: false,
        card2flipped: false,
        flippedTiles: 0,
        chosenLevel: "",
        numMoves: 0,
        init: function(args) {
            var self = this;
            this.outSrc = args.outSrc;
            this.cards = shuffle(args.cards);
            this.container = $(args.container);
            this._setupGame();
        },

        hideNode: function(id) {
            this.addClass(id, "hide");
        },

        showNode: function(id) {
            this.removeClass(id, "hide");
        },

        addClass: function(id, className) {
            this.main.find("#" + id).addClass(className);
        },

        removeClass: function(id, className) {
            this.main.find("#" + id).removeClass(className);
        },

        replaceContent: function(id, content) {
            this.main.find("#" + id).html(content);
        },

        _setupGame: function() {
            var self = this;
            this.gameState = 1;
            this.cards = shuffle(this.cards);
            this.card1 = "";
            this.card2 = "";
            this.card1id = "";
            this.card2id = "";
            this.card1flipped = false;
            this.card2flipped = false;
            this.flippedTiles = 0;
            this.chosenLevel = "";
            this.numMoves = 0;
            this.container.empty();
            if (this.main) this.main.remove();
            var main = this.main = $(__mainTpl).appendTo(this.container);
            $("#mg__button--restart").on("click", function() {
                self.resetGame();
            });
            $(".mg__start-screen--level-select").delegate("span", "click", function() {
                if (self.gameState === 1) {
                    self._setupGameWrapper($(this), main);
                }
            });
        },

        _setupGameWrapper: function(levelNode, mainSelector) {
            this.level = levelNode.data("level");
            this.hideNode("mg__start-screen");
            this.showNode("mg__wrapper");
            this.addClass("mg__contents", "mg__level-" + this.level);
            this.chosenLevel = this.level;
            this.replaceContent("mg__meta--level", this.chosenLevel);
            this._renderTiles();
        },

        _renderTiles: function() {
            var self = this;
            this.gridX = this.level * 2 + 2;
            this.gridY = this.gridX / 2;
            this.numTiles = this.gridX * this.gridY;
            this.halfNumTiles = this.numTiles / 2;
            this.newCards = [];
            for (var i = 0; i < this.halfNumTiles; i++) {
                this.newCards.push(this.cards[i], this.cards[i]);
            }
            this.newCards = shuffle(this.newCards);
            var num = count = this.numTiles,
                j = 0,
                arrays = [],
                size = 4;
            while (num > 0) {
                var arr = [];
                for (var _i = 0; _i < 4; _i++) {
                    (function(__i) {
                        arr.push(count - (__i + j * size));
                    })(_i);
                }
                arrays.push(arr);
                j = j + 1;
                num = num - 4;
            }

            var content = this.main.find("#mg__contents");
            arrays.forEach(function(arr, index1) {
                var row = $("<div>").attr({
                    class: "row"
                }).appendTo(content);
                arr.forEach(function(item, index2) {
                    var n = (index1 * 4) + index2;
                    $$("<div>").attr({
                        class: "mg__tile col-xs-6 col-sm-3 mg__tile-" + n
                    }).addContent({
                        template: __cardTpl,
                        id: this.newCards[n]["id"],
                        "out-src": this.outSrc,
                        "inside-src": this.newCards[n]["img"]
                    }).appendTo(row);
                }, this);
            }, this);
            this.gameState = 2;

            this.trigger(createEvent("gameStarted", {
                game: this
            }));
            content.delegate(".mg__tile--inner", "click", function(e) {
                var target = $(e.currentTarget);
                if (!target.hasClass("flipped")) {
                    if (self.card1flipped === false && self.card2flipped === false) {
                        target.addClass("flipped");
                        self.card1 = target;
                        self.card1id = target.data("id");
                        self.card1flipped = true;
                    } else if (self.card1flipped === true && self.card2flipped === false) {
                        target.addClass("flipped");
                        self.card2 = target;
                        self.card2id = target.data("id");
                        self.card2flipped = true;
                        if (self.card1id == self.card2id) {
                            self._gameCardsMatch();
                        } else {
                            self._gameCardsMismatch();
                        }
                    }
                }
            });
        },


        _gameCardsMatch: function() {
            // cache this
            var self = this;

            // add correct class
            window.setTimeout(function() {
                self.card1.addClass("correct");
                self.card2.addClass("correct");
            }, 300);

            // remove correct class and reset vars
            window.setTimeout(function() {
                self.card1.removeClass("correct");
                self.card2.removeClass("correct");
                self._gameResetVars();
                self.flippedTiles = self.flippedTiles + 2;
                if (self.flippedTiles == self.numTiles) {
                    self.winGame();
                }
            }, 1500);

            // plus one on the move counter
            this._gameCounterPlusOne();
        },

        _gameResetVars: function() {
            this.card1 = "";
            this.card2 = "";
            this.card1id = "";
            this.card2id = "";
            this.card1flipped = false;
            this.card2flipped = false;
        },

        _gameCardsMismatch: function() {
            // cache this
            var self = this;

            // remove "flipped" class and reset vars
            window.setTimeout(function() {
                self.card1.removeClass("flipped");
                self.card2.removeClass("flipped");
                self._gameResetVars();
            }, 900);

            // plus one on the move counter
            this._gameCounterPlusOne();
        },

        _gameResetVar: function() {
            this.card1 = "";
            this.card2 = "";
            this.card1id = "";
            this.card2id = "";
            this.card1flipped = false;
            this.card2flipped = false;
        },

        _gameCounterPlusOne: function() {
            this.numMoves = this.numMoves + 1;
            this.moveCounterUpdate = this.numMoves;
            this.replaceContent("mg__meta--moves", this.numMoves);
        },


        winGame: function() {
            var self = this;
            var div = $$("<div>").addContent({
                template: __endTpl,
                num: this.numMoves
            });
            div.find("#mg__onend--restart").on("click", function() {
                self.resetGame();
            });
            // run callback
            this.trigger(createEvent("gameEnded", {
                data: {
                    game: this,
                    tpl: div
                }
            }));
        },
        resetGame: function() {
            this._setupGame();
        }
    });
});
