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
                    type: "scripts/routes/home/HomeController"
                }
            },
            "game": {
                pathto: "/game",
                data: {
                    name: 'game',
                    navName: "照片游戏"
                },
                controller: {
                    type: "scripts/routes/game/GameController"
                }
            },
            "login": {
                pathto: "/login",
                data: {
                    name: 'login',
                    navName: "登录"
                },
                controller: {
                    type: "scripts/routes/auth/AuthController"
                }
            }
        }
    };
    return config;
});

