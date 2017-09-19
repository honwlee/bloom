'use strict';
const Contact = require('../models/Contact').Contact,
    _Event = require('../models/Event')._Event,
    User = require('../models/User').User,
    Group = require('../models/Group').Group;
module.exports = {
    index: function(req, res) {
        res.json({
            group: Group.show(),
            events: _Event.list(),
            users: User.userList(),
            use: req.user,
            contacts: Contact.list()
        });
    }
}
