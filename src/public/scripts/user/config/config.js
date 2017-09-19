define([], function() {
    var config = {
        "name": "user",
        "title": "User",
        "baseUrl": "/user/:username",
        "homePath": "",
        "page": {
            "routeViewer": "#bloomUserArea"
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
            "profile": {
                pathto: "/profile",
                data: {
                    name: 'profile',
                    navName: "Profile"
                },
                lazy: true,
                controller: {
                    type: "scripts/routes/profile/ProfileController"
                }
            },
            "blog": {
                pathto: "/blog",
                data: {
                    name: 'blog',
                    navName: "Blog"
                },
                lazy: true,
                controller: {
                    type: "scripts/routes/blog/BlogController"
                }
            },
            "album": {
                pathto: "/album",
                data: {
                    name: 'album',
                    navName: "Album"
                },
                lazy: true,
                controller: {
                    type: "scripts/routes/album/AlbumController"
                }
            }
        }
    };
    return config;
});

