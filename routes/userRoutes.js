const express = require('express');
const constants = require('../commons/Constants');
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/check-auth");
const logger = require('log4js');
const sgMail = require('@sendgrid/mail');

router.get('/userData/:userId', checkAuth, function (req, res, next) {
    if (!req.params.userId) { 
        logger.error("Id de usuario requerido");
        return res.status(401).json({
            message: "Id de usuario requerido"
        });
    }
    User.findById(req.params.userId).then(user => { 
        if (!user) { 
            return res.status(400).json({
                message: 'El usuario solicitado no existe'
            });
        }
        res.status(200).json({
            code: 'ok',
            email: user.email
        });
    }).catch(err => {
        logger.error(err);
        res.status(400).json({
            message: 'El usuario no existe',
            err: err
        });
    })
});

router.post('/iniciarSesion', function(req, res, next) {
    let fetchedUser;
    User.find({ email: req.body.email }).then(user => {
        if (!user) {
            return res.status(401).json({
                message: "La autenticación falló"
            });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user[0].password);
    }).then(result => {
        if (!result) {
            return res.status(401).json({
                message: "La autenticación falló"
            });
        }
        const token = jwt.sign({
            email: fetchedUser.email,
            userId: fetchedUser._id
        }, constants.SECRET_WORD, {
            expiresIn: "1h"
        });
        res.status(200).json({
            code: 'ok',
            token: token,
            expiresIn: 3600,
            userId: fetchedUser[0]._id
        });
    }).catch(err => {
        return res.status(401).json({
            message: "La autenticación falló",
            err: err
        });
    });
});

router.post('/registrar', function(req, res, next) {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            email: req.body.email,
            username: req.body.username,
            password: hash,
            temporaryToken: jwt.sign({
                email: req.body.email
            }, constants.SECRET_WORD, {
                expiresIn: "1h"
            })
        });
        user.save().then(result => {
            res.status(201).json({
                message: 'Usuario creado exitosamente, revisa tu correo para activar tu cuenta',
                result: result,
                code: 'ok'
            });
            //send email to new user
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
                to: req.body.email,
                from: 'Gildardo Ortiz, chilcho1939@gmail.com',
                subject: 'Gracias por unirte a nuestra red',
                text: 'Bienvenido',
                html: `<p>Hola ${user.username}, bienvenido al servicio de correos de Gildardo Ortiz.`
                + ' Donde podrás integrar la funcionalidad de envío de correos a tu sitio web <strong>sin costo.</strong >' +
                + ' Para activar tu cuenta, por favor da click en la siguiente dirección: <a href="http://localhost:8999/api/accounts/verificationEmail/activateAccount/" ' + user.temporaryToken + '">http://localhost:8999/api/accounts/verificationEmail/activateAccount</a></p>'
            };
            sgMail.send(msg);
        }).catch(err => {
            res.status(500).json({
                error: err,
                code: 'error'
            });
            console.log(err);
        });
    });
});

module.exports = router;