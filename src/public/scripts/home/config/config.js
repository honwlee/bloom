define([], function() {
    var config = {
        "name": "home",
        "title": "Home",
        "baseUrl": "",
        "homePath": "/",
        "tokenApi": "http://backend.ihudao.dt.hudaokeji.com/api/token",
        "backendApi": "http://backend.ihudao.dt.hudaokeji.com/api/v1/bloom/group",
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
                    type: "scripts/routes/invitative/InvitativeController"
                }
            }
        }
    };
    return config;
});

