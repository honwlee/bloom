'use strict';
const Contact = require('../models/Contact').Contact;
const json2xls = require('json2xls');
module.exports = {
    index: function(req, res) {
        res.json(Contact.list(req.query.sort, req.query.direction));
    },

    show: function(req, res) {
        let contact = Contact.findBy({ id: req.query.id });
        res.json(contact);
    },

    update: function(req, res) {
        let contact;
        if (req.body.id) {
            contact = Contact.update(req.body);
        } else {
            contact = Contact.create(req.body);
        }
        res.json(contact)
    },

    create: function() {
        let contact = Contact.create(req.body);
        res.json(contact)
    },

    delete: function(req, res) {
        Contact.delete(req.body);
        res.json({ status: true, msg: "删除成功！" });
    },

    import: function(req, res) {
        res.json(Contact.importData());
    },

    downloadSize: function(req, res) {
        let xls = json2xls(Contact.list().filter(function(contact){
            return contact.clothSize;
        }).map(function(contact){
            return {
                "姓名": contact.username,
                "衣服尺寸": contact.clothSize
            };
        }));
        res.writeHead(200, {
            'Content-Type': 'application/vnd.openxmlformats',
            'Content-disposition': 'attachment;filename=cloth-size.xlsx',
            'Content-Length': xls.length
        });
        res.end(new Buffer(xls, 'binary'));
    },

    download: function(req, res) {
        let xls = json2xls(Contact.list().map(function(contact){
            return {
                "姓名": contact.username,
                "地址": contact.address,
                "工作": contact.job,
                "工作地址": contact.jobAddress,
                "手机": contact.mobile,
                "生日": contact.birthday
            };
        }));
        res.writeHead(200, {
            'Content-Type': 'application/vnd.openxmlformats',
            'Content-disposition': 'attachment;filename=contacts.xlsx',
            'Content-Length': xls.length
        });
        res.end(new Buffer(xls, 'binary'));
    }
}
