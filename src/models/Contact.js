'use strict';
const Model = require("./_Base").Model,
    path = require('path'),
    fs = require('fs');

exports.Contact = class Contact extends Model {
    static list(sortKey = "status", direction = "asc") {
        return Model.list("contacts", sortKey, direction);
    }
    static findBy(args) {
        return Model.findBy("contacts", args);
    }
    static create(args) {
        return Model.create("contacts", args);
    }
    static update(args) {
        return Model.update("contacts", "id", args);
    }
    static delete(args) {
        return Model.delete("contacts", args);
    }
    static importData() {
        let contacts = JSON.parse(fs.readFileSync(path.join(__dirname, "../dbs/contacts.json"), 'utf8'));
        let results = [];
        contacts.forEach(function(contact) {
            results.push(Model.findOrCreate("contacts", "username", contact));
        });
        return results;
    }
    static exportData() {

    }
}
