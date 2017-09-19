define([
    "skylark/langx",
    "./partial",
    "jquery",
    "handlebars"
], function(langx, partial, $, handlebars) {
    var Normal = langx.Evented.inherit({
        klassName: "NormalColor",
        init: function(config) {
            this.dom = this._buildDom();
            // var copiedHex = ko.observable();
            // var clipboard = new Clipboard('#clipboardItem');

            // clipboard.on('success', function(el) {
            //     console.clear();
            //     console.info('Action:', el.action);
            //     console.info('Text:', el.text);
            //     console.info('Trigger:', el.trigger);
            //     el.clearSelection();

            //     copiedHex(el.text);
            // });

            // ///

            // var selectedColor = ko.observable("Red"); // lazy


        },

        _buildDom: function() {
            partial.get("color-partial");
            var tpl = handlebars.compile("{{> color-partial}}");
            this.tpl = tpl();
            var div = $("<div>").html(this.tpl);
            return div[0].firstChild;
        },
        start: function() {
            return this.dom;
        }
    });

    var Gradation = langx.Evented.inherit({
        klassName: "GradationColor",
        init: function(config) {
            this._buildDom();

        },

        _buildDom: function() {
            for (var i = 1; i < 6; i++) {

            }
        },
        start: function() {
            return this.dom;
        }
    });

    var Bubble = langx.Evented.inherit({
        klassName: "GradationColor",
        init: function(config) {
            this.dom = this._buildDom();
        },

        _initColor: function(_args) {
            var colorPicker = this.colorPicker = (function() {

                var config = {
                    baseColors: [
                        [46, 204, 113],
                        [52, 152, 219],
                        [155, 89, 182],
                        [52, 73, 94],
                        [241, 196, 15],
                        [230, 126, 34],
                        [231, 76, 60]
                    ],
                    lightModifier: 20,
                    darkModifier: 0,
                    transitionDuration: 200,
                    transitionDelay: 25,
                    variationTotal: 10
                };

                var _colorsMap = {};

                var state = {
                    activeColor: [0, 0, 0]
                };

                function init(selector, args) {
                    createColorPicker(selector, function() {
                        appendBaseColors(selector);
                    });

                    addEventListeners(selector, args);
                    if (args.color) {
                        var selectedIndex = args.color.split("@@");
                        setFirstColorActive(selector, function() {
                            setFirstModifiedColorActive(selector, selectedIndex[0], selectedIndex[1]);
                        }, selectedIndex[0]);
                    } else {
                        setFirstColorActive(selector, function() {
                            setFirstModifiedColorActive(selector);
                        });
                    }
                }

                function setActiveBaseColor(selector, el) {
                    selector.find('.color.active').removeClass('active');
                    el.addClass('active');
                    state.activeBaseColor = el.data('color');
                    state.baseIndex = el.data('index');
                }

                function setActiveColor(selector, el) {
                    selector.find('.color-var.active').removeClass('active');
                    el.addClass('active');
                    state.activeColor = el.data('color'); //.split(',');
                    state.subIndex = el.data('index');
                }

                function addEventListeners(selector, args) {
                    selector.on('click', '.color', function() {
                        var data = $(this).data(),
                            index = data.index,
                            color = data.color.split(',');
                        setActiveBaseColor(selector, $(this));

                        hideVariations(selector, function() {
                            createVariations(selector, index, color, function() {
                                setDelays(selector, function() {
                                    showVariations(selector);
                                });
                            });
                        });
                    });

                    selector.on('click', '.color-var', function() {
                        setActiveColor(selector, $(this));
                        setBackgroundColor(args.bgSelector);
                    });
                }

                function setFirstColorActive(selector, callback, index) {
                    if (index && _colorsMap[index]) {
                        _colorsMap[index].dom.trigger('click');
                    } else {
                        selector.find('.color').eq(1).trigger('click');
                    }
                    callback();
                }

                function setFirstModifiedColorActive(selector, parentIndex, index) {
                    setTimeout(function() {
                        if (parentIndex && _colorsMap[parentIndex] && index) {
                            _colorsMap[parentIndex].children[index - 1].dom.trigger('click');
                        } else {
                            selector.find('.color-var').eq(7).trigger('click');
                        }
                    }, 500);
                }

                function createColorPicker(selector, callback) {
                    selector = selector.find(".color-picker");
                    selector.append('<div class="base-colors"></div>');
                    selector.append('<div class="varied-colors"></div>');
                    selector.append('<div class="active-color"></div>');
                    selector.append('<div class="color-history"></div>');

                    callback();
                };

                function appendBaseColors(selector) {
                    for (i = 0; i < config.baseColors.length; i++) {
                        var color = 'rgb(' + config.baseColors[i].join() + ')',
                            baseDom = $('<div>').attr({
                                class: 'color'
                            }).data({
                                index: i + 1,
                                color: config.baseColors[i].join()
                            }).css({
                                "background-color": color
                            }).appendTo(selector.find('.base-colors'));
                        _colorsMap[i + 1] = {
                            color: color,
                            dom: baseDom
                        };
                    }
                };

                function generateColor(color) {
                    return 'rgb(' + config.baseColors[i].join() + ')';
                };

                function setBackgroundColor(bgSelector) {
                    bgSelector.css({
                        'background': 'rgb(' + state.activeColor + ')'
                    });
                }

                function createVariations(selector, parentIndex, color, callback) {
                    var colorItem = _colorsMap[parentIndex],
                        mainS = selector.find('.varied-colors');
                    mainS.html('');
                    if (colorItem.children) {
                        colorItem.children.forEach(function(sub) {
                            sub.subDom.appendTo(mainS);
                        });
                    } else {
                        var subItem = colorItem.children = [];

                        for (var i = 0; i < config.variationTotal; i++) {
                            var newColor = [];
                            for (var x = 0; x < color.length; x++) {
                                var modifiedColor = (Number(color[x]) - 100) + (config.lightModifier * i);

                                if (modifiedColor <= 0) {
                                    modifiedColor = 0;
                                } else if (modifiedColor >= 255) {
                                    modifiedColor = 255;
                                }

                                newColor.push(modifiedColor);
                            }
                            var subDom = $('<div>').attr({
                                class: 'color-var'
                            }).data({
                                index: i + 1,
                                color: newColor
                            }).css({
                                "background-color": 'rgb(' + newColor + ')'
                            }).appendTo(mainS);
                            subItem.push({
                                parent: parentIndex,
                                index: i + 1,
                                color: newColor,
                                dom: subDom
                            });
                        }
                    }
                    callback();
                }

                function setDelays(selector, callback) {
                    selector.find('.color-var').each(function(x) {
                        $(this).css({
                            'transition': 'transform ' + (config.transitionDuration / 1000) + 's ' + ((config.transitionDelay / 1000) * x) + 's'
                        });
                    });

                    callback();
                }

                function showVariations(selector) {
                    setTimeout(function() {
                        selector.find('.color-var').addClass('visible');
                    }, (config.transitionDelay * config.variationTotal));
                }

                function hideVariations(selector, callback) {
                    selector.find('.color-var').removeClass('visible').removeClass('active');

                    setTimeout(function() {
                        callback();
                    }, (config.transitionDelay * config.variationTotal));
                }

                return {
                    init: init,
                    getColor: function() {
                        return state.baseIndex + '@@' + state.subIndex;
                    }
                };
            }());

            colorPicker.init(this.dom, _args);
            return colorPicker.getColor();
        },

        _buildDom: function() {
            var div = $("<div>").attr({
                class: "bubble-color-picker"
            }).html("<div class='color-picker'></div>");
            return div;
        },

        getColor: function() {
            return this.colorPicker.getColor();
        },

        start: function(args) {
            this._initColor(args);
            return this.dom;
        }
    });

    return {
        normal: Normal,
        gradation: Gradation,
        bubble: Bubble,
        colorText: function(textSelector) {
            textSelector.html(function(i, html) {
                var chars = $.trim(html).split("");
                return '<span>' + chars.join('</span><span>') + '</span>';
            }).addClass("anim-text-flow");
        }
    };
});
