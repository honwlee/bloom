'use strict';
const Group = require('../models/Group').Group;
module.exports = {
    index: function() {

    },
    show: function(req, res) {
        res.json(Group.show());
    },
    update: function(req, res) {
        let group = Group.update(req.body);
        res.json(group);
    },

    create: function() {

    },

    delete: function() {

    }
}
