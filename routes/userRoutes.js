const express = require('express');
const constants = require('../commons/Constants');
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/check-auth");
const logger = require('../configs/log4js');
const sgMail = require('@sendgrid/mail');

router.get('/userData/:userId', checkAuth, function (req, res, next) {
    if (!req.params.userId) {
        logger.error("Id de usuario requerido");
        return res.status(401).json({
            message: "Id de usuario requerido"
        });
    }
    User.findOne({ _id: req.params.userId, active: true }).then(user => {
        if (!user) {
            return res.status(400).json({
                message: 'El usuario solicitado no existe'
            });
        }
        res.status(200).json({
            code: 'ok',
            email: user.email,
            username: user.username
        });
    }).catch(err => {
        logger.error(err);
        res.status(400).json({
            message: 'El usuario no existe',
            err: err
        });
    })
});

router.post('/iniciarSesion', function (req, res, next) {
    logger.info("Data: " + JSON.stringify(req.body));
    let fetchedUser;
    User.find({ email: req.body.email }).then(user => {
        if (!user) {
            logger.error("No se encontró el usuario");
            return res.status(401).json({
                message: "No se encontró el usuario"
            });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user[0].password);
    }).then(result => {
        if (!result) {
            logger.error("Contraseña no válida");
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
        logger.error(err);
        return res.status(401).json({
            message: "La autenticación falló",
            err: err
        });
    });
});

router.post('/registrar', function (req, res, next) {
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            logger.error("Error al registrar usuario, ya existe cuenta");
            return res.status(401).json({
                message: "El correo " + req.body.email + " ya existe en la base de datos"
            });
        }
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
            user.save().then(document => {
                logger.info("usuario creado: " + JSON.stringify(document));
                try {
                    logger.info("Enviando correo a: " + document.email);
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    const msg = {
                        to: req.body.email,
                        from: 'chilcho1939@gmail.com',
                        subject: 'Gracias por unirte a nuestra red',
                        text: 'Bienvenido',
                        html: `<p>Hola ${user.username}, bienvenido al servicio de correos de Gildardo Ortiz.</p>`
                            + '<p>Donde podrás integrar la funcionalidad de envío de correos a tu sitio web <strong>sin costo.</strong ></p>'
                            + '<p>Para activar tu cuenta, por favor da click en la siguiente dirección: <a href="http://localhost:8999/#!/activate/' + user.temporaryToken + '">Activar cuenta</a></p>'
                    };
                    sgMail.send(msg);
                    logger.info("Correo envíado");
                    res.status(201).json({
                        message: 'Usuario creado exitosamente, revisa tu correo para activar tu cuenta',
                        code: 'ok'
                    });
                } catch (e) {
                    logger.error(e);
                }
            }).catch(err => {
                res.status(500).json({
                    error: err,
                    code: 'error'
                });
                logger.error(err);
            });
        });
    });
});

/**
 *  Método que activa la cuenta del usuario nuevo
 *  @param token
 */
router.put('/activateAccount/:token', function (req, res, next) {
    logger.info("Activando cuenta");
    User.findOne({ temporaryToken: req.params.token }, function (err, user) {
        if (err) {
            logger.error("Error: " + err);
            return res.status(500).json({
                message: 'Error al activar la cuenta',
                err: err
            });
        }
        var token = req.params.token;
        jwt.verify(token, constants.SECRET_WORD, function (err, decoded) {
            if (err) {
                logger.error("Error: " + err);
                return res.status(401).json({
                    message: 'El link de activación ha expirado'
                });
            } else if (!user) {
                logger.error("El usuario no se encontro en la base de datos o el token expiró")
                return res.status(404).json({
                    message: 'El usuario no existe en la base de datos o el token expiró'
                })
            } else {
                user.temporaryToken = false;
                user.active = true;
                try {
                    user.save((err) => {
                        if (err) {
                            throw "Error al activar la cuenta. Error: " + err;
                        }
                        //send email to new user
                        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                        const msg = {
                            to: user.email,
                            from: 'chilcho1939@gmail.com',
                            subject: 'Cuenta activada exitosamente',
                            text: 'Bienvenido',
                            html: `<p>Hola ${user.username}, has activado exitosamente tu cuenta.`
                        };
                        sgMail.send(msg);
                    })
                } catch (e) {
                    logger.error(e);
                    return res.status(500).json({
                        message: "Error activando la cuenta",
                        err: e
                    });
                }
            }
            next()
        })
    });
})

module.exports = router;