define([
    "skylark/spa",
    "skylark/async",
    "skylark/langx",
    "jquery",
    "skylark/query",
    "skylark/eventer",
    "common/color",
    "text!scripts/routes/invitative/invitative.html",
    "ityped",
    'countdown',
    'lodash'
], function(spa, async, langx, $, _$, eventer, colorContrl, invitativeTpl, ityped, countdown, _) {
    var getRandomColor = function() {
            var colors = [
                    "#cfd9df", "#a1c4fd", "#8fd3f4", "#e6dee9", "#c3cfe2",
                    "#a8edea", "#e0c3fc", "#ebbba7", "#fff1eb", "#accbee",
                    "#c1dfc4", "#deecdd", "#fbfcdb", "#6a85b6", "#9face6"
                ],
                colorLength = colors.length;
            return colors[Math.floor(Math.random() * colorLength)];
        },

        changeNodeStyle = function(node, selector) {
            var color1 = getRandomColor(),
                color2 = getRandomColor();
            node.find(selector).css({
                color: "#333",
                "background": color1,
                "text-shadow": "0 0 5px " + color1
            });
            node.find(selector + ".bottom").css({
                "border-top": "0.5px solid " + color2,
                "border-bottom": "0.5px solid " + color2
            });
        };
    return spa.RouteController.inherit({
        klassName: "InvitativeController",

        preparing: function(e) {
            // var deferred = new async.Deferred();
            // $.get("http://localhost:3000/api/v1/bootstrap/bloom/public", function(data) {
            //     data;
            //     debugger;
            //     deferred.resolve();
            // });
            // e.result = deferred.promise;
        },

        rendering: function(e) {
            var selector = $(langx.trim(invitativeTpl));
            var div = $("<div>").html(langx.trim(selector.find("#main").html()));
            e.content = div.html();
        },

        _initItyped: function(tpl) {
            var timeout, self = this;
            ityped.init('#ityped', {
                strings: ['十五年匆匆岁月...', '请停下为生活奔波的脚步...', '让我们一起回忆过往时光...', '再一次谱写青春的隽语...'],
                loop: false,
                typeSpeed: 200, //default
                //optional
                backSpeed: 200, //default
                //optional
                startDelay: 200, //default
                //optional
                backDelay: 500, //default
                //optional
                //optional
                showCursor: true, //default
                //optional
                cursorChar: "|", //default
                // optional callback called once the last string has been typed
                onFinished: function() {
                    var ityped = $("#itypedContainer");
                    ityped.html(tpl);
                    if (timeout) clearTimeout(timeout);
                    timeout = setTimeout(function() {
                        ityped.html('<span id="ityped" class="ityped"></span>');
                        self._initItyped(tpl);
                    }, 5000);
                }
            });
        },
        _initCountdown: function(tpl) {
            var labels = [
                    ['days', '天'],
                    ['hours', '时'],
                    ['minutes', '分'],
                    ['seconds', '秒']
                ],
                nextYear = '2017/10/03',
                currDate = '00:00:00:00:00',
                nextDate = '00:00:00:00:00',
                template = _.template($('#main-example-template').html()),
                parser = /([0-9]{2})/gi,
                $example = $('#countdown');
            // Parse countdown string to an object
            function strfobj(str) {
                var parsed = str.match(parser),
                    obj = {};
                labels.forEach(function(label, i) {
                    obj[label[0]] = parsed[i]
                });
                return obj;
            }
            // Return the time components that diffs
            function diff(obj1, obj2) {
                var diff = [];
                labels.forEach(function(key) {
                    if (obj1[key[0]] !== obj2[key[0]]) {
                        diff.push(key[0]);
                    }
                });
                return diff;
            }
            // Build the layout
            var initData = strfobj(currDate);
            labels.forEach(function(label, i) {
                // var node = template({
                //     curr: initData[label[0]],
                //     next: initData[label[0]],
                //     label: label[0],
                //     sLabel: label[1]
                // });
                // $example.append(node);
                var div = _$("<div>").addContent({
                    template: tpl,
                    curr: initData[label[0]],
                    next: initData[label[0]],
                    label: label[0],
                    sLabel: label[1]
                });
                var node = _$(div[0].firstChild).appendTo(_$('#countdown'));
                changeNodeStyle(node, ".curr");
                changeNodeStyle(node, ".next");
            });
            // Starts the countdown
            $example.countdown(nextYear, function(event) {
                var newDate = event.strftime('%D:%H:%M:%S'),
                    data;
                if (newDate !== nextDate) {
                    currDate = nextDate;
                    nextDate = newDate;
                    // Setup the data
                    data = {
                        'curr': strfobj(currDate),
                        'next': strfobj(nextDate)
                    };
                    // Apply the new values to each node that changed
                    diff(data.curr, data.next).forEach(function(label) {
                        var selector = '.%s'.replace(/%s/, label),
                            $node = $example.find(selector);
                        // Update the node
                        $node.removeClass('flip');
                        var color = getRandomColor();
                        changeNodeStyle($node, ".curr");
                        changeNodeStyle($node, ".next");
                        $node.find('.curr').text(data.curr[label]);
                        $node.find('.next').text(data.next[label]);
                        // Wait for a repaint to then flip
                        setTimeout(function() {
                            $node.addClass('flip');
                        }, 50);
                    });
                }
            });
        },

        entered: function() {
            $(".desc-container .caption p").each(function(index, el) {
                colorContrl.colorText($(el));
            });
            var selector = $(langx.trim(invitativeTpl));
            this._initCountdown(langx.trim(selector.find("#mainExampleTemplate").html()));
            this._initItyped();
            colorContrl.colorText($("#ityped"));
        },
        exited: function() {

        }
    });
});
