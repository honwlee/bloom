define([], function() {
    var config = {
        "name": "party",
        "title": "Party",
        "baseUrl": "/party",
        "homePath": "/",
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
                lazy: true,
                controller: {
                    type: "scripts/routes/home/HomeController"
                }
            },
            "splendid": {
                pathto: "/splendid",
                data: {
                    name: 'splendid',
                    navName: "精彩瞬间"
                },
                lazy: true,
                controller: {
                    type: "scripts/routes/splendid/SplendidController"
                }
            },
            "contact": {
                pathto: "/contact",
                data: {
                    name: 'contact',
                    navName: "联络簿"
                },
                lazy: true,
                controller: {
                    type: "scripts/routes/contact/ContactController"
                }
            },
            "profile": {
                pathto: "/profile",
                data: {
                    name: 'profile',
                    navName: "我的主页"
                },
                lazy: true,
                controller: {
                    type: "scripts/routes/profile/ProfileController"
                }
            }
        }
    };
    return config;
});