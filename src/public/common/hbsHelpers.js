define([
    "skylark/langx",
    "handlebars"
], function(langx, handlebars) {
    handlebars.registerHelper('if_eq', function(a, b, opts) {
        if (a == b) // Or === depending on your needs
            return opts.fn(this);
        else
            return opts.inverse(this);
    });

    handlebars.registerHelper('withHash', function(opts) {
        return opts.fn(opts.hash);
    });

    handlebars.registerHelper('dynamictemplate', function(template, context, opts) {
        template = template.replace(/\//g, '_');
        var f = handlebars.partials[template];
        if (!f) {
            return "Partial not loaded";
        }
        return new handlebars.SafeString(f(context));
    });
});
