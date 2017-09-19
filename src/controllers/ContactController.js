'use strict';
const Contact = require('../models/Contact').Contact;
module.exports = {
    index: function(req, res) {
        res.json(Contact.list());
    },

    show: function(req, res) {

    },

    update: function(req, res) {
        let contact = Contact.update(req.body);
        res.json(contact)
    },

    create: function() {
        let contact = Contact.create(req.body);
        res.json(contact)
    },

    delete: function() {

    },

    import: function(req, res) {
        res.json(Contact.importData());
    }
}
