'use strict';
const Model = require("./_Base").Model,
    path = require('path'),
    fs = require('fs'),
    shortid = require('shortid');

exports.Group = class Group extends Model {
    static show() {
        return Model.first("groups");
    }
    static update(args) {
        return Model.update("groups", "id", args);
    }
}
