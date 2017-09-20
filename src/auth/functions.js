const bcrypt = require('bcryptjs'),
    dbms = require('../lib/dbms/'),
    request = require('request'),
    path = require('path'),
    User = require('../models/User').User,
    baseUrl = "http://backend.ihudao.dt.hudaokeji.com",
    // baseUrl = "http://ube.ihudao.dt.hudaokeji.com:3000",
    Q = require('q');
//used in local-signup strategy
exports.localReg = function(args) {
    let deferred = Q.defer();
    let result = User.findBy({
        username: args.username
    });
    if (null != result) {
        console.log("USERNAME ALREADY EXISTS:", result.username);
        deferred.resolve({
            status: false,
            result: {},
            msg: "账号:" + result.username + "已经被注册，请换个账号再试！"
        }); // username exists
    } else {
        try {
            request.post({
                url: baseUrl + '/api/v1/bloom/registry',
                form: {
                    display: args.display,
                    email: args.email,
                    username: args.username,
                    password: args.password
                }
            }, function(error, response, body) {
                data = JSON.parse(body);
                if (data.status) {
                    console.log("CREATING USER:", args.username);
                    let hash = bcrypt.hashSync(args.password, 8);
                    let user = {
                        "display": args.display,
                        "username": args.username,
                        "password": hash,
                        "token": data.token,
                        "email": args.email
                    };
                    User.create(user);
                    deferred.resolve({
                        status: true,
                        user: user,
                        msg: "注册成功，请联系管理员激活账号"
                    });
                } else {
                    deferred.resolve({
                        status: false,
                        user: {},
                        msg: data.msg
                    });
                    console.log(data.msg);
                }
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    return deferred.promise;
};


//check if user exists
//if user exists check if passwords match (use bcrypt.compareSync(password, hash); // true where 'hash' is password in DB)
//if password matches take into website
//if user doesn't exist or password doesn't match tell them it failed
exports.localAuth = function(username, password) {
    let deferred = Q.defer();
    let result = User.findBy({
        username: username
    });
    if (null == result) {
        deferred.resolve({
            status: false,
            msg: "USERNAME NOT FOUND:" + username
        });
    } else {
        try {
            let hash = result.password;
            console.log("FOUND USER: " + result.username);
            if (result.isActive) {

                if (bcrypt.compareSync(password, hash)) {
                    request.post({
                        url: baseUrl + '/api/v1/bloom/login',
                        form: {
                            username: username,
                            password: password
                        }
                    }, function(error, response, body) {
                        let data = JSON.parse(body);
                        if (data.status) {
                            deferred.resolve({
                                status: true,
                                user: result
                            });
                        } else {
                            console.log(data.msg);
                            deferred.resolve({
                                status: false,
                                user: result,
                                msg: data.msg
                            });
                        }
                    });
                } else {
                    console.log("AUTHENTICATION FAILED");
                    deferred.resolve({
                        status: false,
                        user: result,
                        msg: "密码或者账号错误，请确认后再试！"
                    });
                }
            } else {
                console.log("AUTHENTICATION FAILED NEED ACTIVE");
                    deferred.resolve({
                        status: false,
                        user: result,
                        msg: "当前账号还未激活，请联系管理员激活账号"
                    });
            }

        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    return deferred.promise;
}
