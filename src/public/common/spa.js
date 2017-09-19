define([
    "skylark/spa"
], function(spa) {
    spa.Application = spa.Application.inherit({
        showPopPage: function(node) {
            this.getPlugin("popPage").controller.show(node);
        },

        hidePopPage: function() {
            this.getPlugin("popPage").controller.hide();
        },

        getPlugin: function(key) {
            return key ? this._plugins[key] : this._plugins;
        }
    });
    return spa;
});
