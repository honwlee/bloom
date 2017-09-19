'use strict';
const _Event = require('../models/Event')._Event;
module.exports = {
    index: function(req, res) {
        res.json(_Event.list());
    },

    show: function(req, res) {
        let _event = _Event.findBy({id:req.query.id});
        res.json(_event);
    },

    update: function(req, res) {
        let _event = _Event.update(req.body);
        res.json(_event)
    },

    create: function(req, res) {
        let _event = _Event.create(req.body);
        res.json(_event)
    },

    delete: function(req, res) {
        _Event.delete(req.body);
        res.json({ status: true, msg: "删除成功！" });
    },

    import: function(req, res) {
        res.json(_Event.importData());
    }
}
