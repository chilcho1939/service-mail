const express = require('express');
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const Account = require('../models/Account');
const bcrypt = require("bcrypt");

router.post('/findAllByUser', checkAuth, function (req, res, next) {
    Account.find({ registrationUser: req.body.user }).then(results => {
        if (results.length > 0) {
            res.status(200).json({
                message: "Registros obtenidos exitosamente",
                code: 'ok',
                result: results
            });
        } else { 
            res.status(200).json({
                message: "Sin resultados para tu búsqueda",
                code: 'ok'
            });
        }
    }).catch(err => { 
        res.status(500).json({
            message: "Error al obtener los registros",
            err: err
        });
    });
});

router.post('/saveAccount', checkAuth, function (req, res, next) {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const account = new Account({
            host: req.body.host,
            port: req.body.port,
            sourceMail: req.body.sourceMail,
            password: hash,
            deliveryMail: req.body.deliveryMail,
            ccMail: req.body.ccMail,
            registrationDate: new Date(),
            registrationUser: req.body.registrationUser,
            updateDate: new Date(),
            updateUser: req.body.updateUser,
            active: true
        });

        account.save().then(result => {
            res.status(201).json({
                message: 'Registro existoso',
                code: 'ok'
            });
        }).catch(err => {
            res.status(500).json({
                message: 'Error al guardar el registro',
                err: err
            });
            console.log(err);
        });
    })
});

module.exports = router;