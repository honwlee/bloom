define([
    "skylark/spa",
    "skylark/async",
    "skylark/langx",
    "jquery",
    "jquery",
    "skylark/eventer",
    "text!scripts/routes/home/home.html",
    "ityped",
    'countdown'
], function(spa, async, utils, $, _$, eventer, homeTpl, ityped, countdown) {
    return spa.RouteController.inherit({
        klassName: "HomeController",

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
            var selector = $(utils.trim(homeTpl));
            var div = $("<div>").addContent({
                template: utils.trim(selector.find("#main").html())
            });
            e.content = div.html();
        },

        entered: function() {
            ityped.init('#ityped', {
                strings: ['十五年匆匆岁月，', '请停下为生活奔波的脚步...', '我们一起回忆过往时光，', '一起谱写青春的隽语…'],
                loop: true,
                typeSpeed: 100, //default
                //optional
                backSpeed: 100, //default
                //optional
                startDelay: 500, //default
                //optional
                backDelay: 500, //default
                //optional
                //optional
                showCursor: true, //default
                //optional
                cursorChar: "|", //default
                // optional callback called once the last string has been typed
                onFinished: function() {}
            });
            var selector = $(utils.trim(homeTpl));
            var labels = ['weeks', 'days', 'hours', 'minutes', 'seconds'],
                nextYear = '2017/10/02',
                currDate = '00:00:00:00:00',
                nextDate = '00:00:00:00:00',
                parser = /([0-9]{2})/gi,
                $example = _$('#main-example');
            // Parse countdown string to an object
            function strfobj(str) {
                var parsed = str.match(parser),
                    obj = {};
                labels.forEach(function(label, i) {
                    obj[label] = parsed[i]
                });
                return obj;
            }
            // Return the time components that diffs
            function diff(obj1, obj2) {
                var diff = [];
                labels.forEach(function(key) {
                    if (obj1[key] !== obj2[key]) {
                        diff.push(key);
                    }
                });
                return diff;
            }
            // Build the layout
            var initData = strfobj(currDate);
            labels.forEach(function(label, i) {
                var div = $("<div>").addContent({
                    template: utils.trim(selector.find("#main-example-template").html()),
                    curr: initData[label],
                    next: initData[label],
                    label: label,
                    sLabel: label.length < 6 ? label : label.substr(0, 3)
                });
                $(div[0].firstChild).appendTo($('#main-example'));
            });
            // Starts the countdown
            $example.countdown(nextYear, function(event) {
                var newDate = event.strftime('%w:%d:%H:%M:%S'),
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
                        $node.find('.curr').text(data.curr[label]);
                        $node.find('.next').text(data.next[label]);
                        // Wait for a repaint to then flip
                        _.delay(function($node) {
                            $node.addClass('flip');
                        }, 50, $node);
                    });
                }
            });
        },
        exited: function() {

        }
    });
});
