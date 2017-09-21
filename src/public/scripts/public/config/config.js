define([], function() {
    var config = {
        "name": "public",
        "title": "public",
        "baseUrl": "",
        "homePath": "/public",
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
            "user": {
                pathto: "/users/:username",
                data: {
                    name: 'user',
                    navName: "User"
                },
                controller: {
                    type: "scripts/routes/user/UserController"
                }
            }
        }
    };
    return config;
});

