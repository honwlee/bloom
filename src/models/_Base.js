'use strict';
const path = require('path'),
    dbpath = path.join(__dirname, "../dbs"),
    Q = require('q'),
    // baseUrl = "http://ube.ihudao.dt.hudaokeji.com:3000",
    baseUrl = "http://backend.ihudao.dt.hudaokeji.com",
    dbms = require('../lib/dbms/'),
    request = require('request'),
    jsondb = dbms(dbpath, {
        master_file_name: "master.json"
    }),
    shortid = require('shortid'),
    refresh = function() {
        jsondb = dbms(dbpath, {
            master_file_name: "master.json"
        });
    };
//used in local-signup strategy
class Model {
    constructor() {
        this.name = "";
    }
    static refresh() {
        refresh();
    }
    static list(name, sortKey = "id", direction = "asc") {
        let results = jsondb.get(name).sortBy(sortKey).value();
        if (direction == "desc") results = results.reverse();
        return results;

    }
    static first(name) {
        return jsondb.get(name).first().value();
    }
    static last(name) {
        return jsondb.get(name).last().value();
    }
    static findBy(name, args) {
        return jsondb.get(name).find(args).value();
    }
    static create(name, args) {
        args.id = shortid.generate();
        let result = jsondb.get(name).push(args).last().write();
        return result;
    }
    static findOrCreate(name, key, args) {
        let query = {};
        query[key] = args.key;
        let result = jsondb.get(name).find(query).value();
        if (!result) result = Model.create(name, args);
        return result;
    }
    static update(name, queryKey, args) {
        let opt = {};
        opt[queryKey] = args[queryKey];
        let result = jsondb.get(name).find(opt).assign(args).write();
        return result;
    }
    static delete(name, args) {
        let result = jsondb.get(name).remove(args).write();
        return result;
    }
};
exports.Model = Model;
