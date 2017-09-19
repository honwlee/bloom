define([], function() {
    var config = {
        "name": "album",
        "title": "Title",
        "baseUrl": "",
        "homePath": "/",
        "page": {
            "routeViewer": "#pageContainer"
        },
        "plugins": {
            "navbar": {
                hookers: ["starting"],
                controller: {
                    type: "scripts/plugins/navbar/NavbarController"
                }
            }
        },
        "routes": {
            "home": {
                pathto: "/",
                data: {
                    name: 'home',
                    navName: "Home"
                },
                controller: {
                    type: "scripts/routes/home/HomeController"
                }
            }
        }
    };
    return config;
});

