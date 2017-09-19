define([
    "skylark/spa",
    "skylark/langx",
    "jquery"
], function(spa, langx, $) {
    var PopPageController = spa.PluginController.inherit({
        showClass: "show-pop",
        starting: function(evt) {
            var self = this;
            this.popPage = $("<div>").attr({ class: "pop-page" }).appendTo(document.body);
            $("<div>").attr({ class: "overlay" }).on("click", function() {
                self.hide();
            }).appendTo(this.popPage);
            var wrap = $("<div>").attr({
                class: "pop-content-wrap"
            }).appendTo(this.popPage);
            this.contentNode = $("<div>").attr({
                class: "content"
            }).appendTo(wrap);
            $("<a>").attr({
                class: "closePopBtn"
            }).appendTo(wrap).on("click", function() {
                self.hide();
            }).html('<i class="fa fa-close"></i>');
        },

        hide: function() {
            $(this.popPage).removeClass(this.showClass);
            // this.trigger("hiden");
        },

        // a method for host to overwrite, when this page is hide do host method
        onHide: function() {},

        show: function(node) {
            var box = {
                width: "100%",
                height: "100%"
            };
            this.contentNode.empty().html($(node).css(box));
            $(this.popPage).addClass(this.showClass);
            // this.trigger("shown");
        },

        // a method for host to overwrite, when this page is hide do host method
        onShow: function() {}
    });
    return PopPageController;
});
