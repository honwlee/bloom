define([
    "jquery",
    "skylark/langx",
    "text!./_partials.handlebars",
    "./hbsHelpers",
    "handlebars"
], function($, langx, partialsTpl, hbsHelpers, handlebars) {
    var partials = {};
    var selector = $(langx.trim(partialsTpl));
    var _registryPartial = function(name) {
        selector.find("#" + name).each(function(index, partial) {
            handlebars.registerPartial(name, langx.trim($(partial).html()).replace(/\{\{&gt;/g, "{{>"));
            partials[name] = true;
        });
    }
    return {
        get: function(name) {
            if (!partials[name]) _registryPartial(name);
        }
    }
});
