'use strict';
const Model = require("./_Base").Model;

exports.Post = class Post extends Model {
    constructor() {
        this.name = "posts";
    }

    static findBy(args) {
        return Model.findBy("posts", args);
    }
}
