require.config({
    baseUrl: "./",
    waitSeconds: 60,
    packages: [{
        name: "common",
        location: "./common"
    }, {
        name: "scripts",
        location: "./scripts/party"
    }],

    paths: {
        "skylark-all": "/lib/skylark-all",
        "jquery": "https://cdn.bootcss.com/jquery/2.2.0/jquery.min",
        "photoswipe": "https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.2/photoswipe.min",
        "photoswipeUi": "https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.2/photoswipe-ui-default.min",
        "noext": 'https://cdnjs.cloudflare.com/ajax/libs/requirejs-plugins/1.0.3/noext.min',
        "countdown": "/lib/countdown",
        "modernizr": "https://cdn.bootcss.com/modernizr/2.8.3/modernizr",
        "ityped": "https://unpkg.com/ityped@0.0.5?noext",
        "toastr": "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min",
        "bootstrap": "https://cdn.bootcss.com/bootstrap/3.3.6/js/bootstrap.min",
        "handlebars": "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.10/handlebars.amd.min",
        "jotted": "https://cdn.jsdelivr.net/jotted/1.5.1/jotted.min",
        "tether": "https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min",
        "text": "https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text",
        "bootstrap-table": "//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.11.1/bootstrap-table",
        "bootstrap-table-zh-CN": "//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.11.1/locale/bootstrap-table-zh-CN.min",
        "tableExport": "http://rawgit.com/hhurz/tableExport.jquery.plugin/master/tableExport",
        "bt-export": "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.11.1/extensions/export/bootstrap-table-export",
        "bt-mobile": "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.11.1/extensions/mobile/bootstrap-table-mobile",
        "bt-cookie": "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.11.1/extensions/cookie/bootstrap-table-cookie",
        "lodash": "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min"
    },
    shim: {
        "bootstrap": {
            deps: ["jquery"],
            exports: "$"　
        }
    }
});
