const express = require('express');
const User = require("../models/User");
const Account = require('../models/Account');
const EmailTokens = require('../models/EmailTokens');
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/check-auth");
const logger = require('../configs/log4js');
const sgMail = require('@sendgrid/mail');
const mail = require('../configs/mail-server');

router.get('/userData/:userId', checkAuth, function (req, res, _next) {
    if (!req.params.userId) {
        logger.error("Id de usuario requerido");
        return res.status(401).json({
            message: "Id de usuario requerido"
        });
    }
    User.findOne({
        _id: req.params.userId,
        active: true
    }).then(user => {
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

router.post('/iniciarSesion', function (req, res, _next) {
    let fetchedUser;
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (!user) {
            logger.error("No se encontró el usuario");
            return res.status(401).json({
                message: "No se encontró el usuario"
            });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
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
        }, process.env.SECRET_WORD, {
            expiresIn: "1h"
        });
        res.status(200).json({
            code: 'ok',
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id,
            username: fetchedUser.username
        });
    }).catch(err => {
        logger.error(err);
        return res.status(401).json({
            message: "La autenticación falló",
            err: err
        });
    });
});

router.post('/registrar', function (req, res, _next) {
    User.findOne({
        email: req.body.email
    }).then(user => {
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
                }, process.env.SECRET_WORD, {
                    expiresIn: "1h"
                })
            });
            user.save().then(document => {
                try {
                    logger.info("Enviando correo a: " + document.email);
                    const msg = {
                        to: req.body.email,
                        subject: 'Gracias por unirte a nuestra red',
                        text: 'Bienvenido',
                        html: `<p>Hola ${user.username}, bienvenido al servicio de correos para tu sitio web.</p>` +
                            '<p>Donde podrás integrar la funcionalidad de envío de correos a tu sitio web <strong>sin costo.</strong ></p>' +
                            '<p>Para activar tu cuenta, por favor da click en la siguiente dirección: <a href="' + process.env.BASE_URL + '/#!/activate/' + user.temporaryToken + '">Activar cuenta</a></p>'
                    };
                    mail.sendEmail(msg);
                    res.status(201).json({
                        message: 'Usuario creado exitosamente, revisa tu correo para activar tu cuenta o bien tu bandeja de SPAM',
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
router.put('/activateAccount/:token', function (req, res, _next) {
    logger.info("Activando cuenta");
    User.findOne({
        temporaryToken: req.params.token
    }, function (err, user) {
        if (err) {
            logger.error("Error: " + err);
            return res.status(500).json({
                message: 'Error al activar la cuenta',
                err: err
            });
        }
        var token = req.params.token;
        jwt.verify(token, process.env.SECRET_WORD, function (err, _decoded) {
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
                        const msg = {
                            to: user.email,
                            subject: 'Cuenta activada exitosamente',
                            text: 'Bienvenido',
                            html: `<p>Hola ${user.username}, has activado exitosamente tu cuenta.`
                        };
                        mail.sendEmail(msg);
                        return res.status(200).json({
                            message: "Cuenta activada",
                            code: 'ok'
                        })
                    })
                } catch (e) {
                    logger.error(e);
                    return res.status(500).json({
                        message: "Error activando la cuenta",
                        err: e
                    });
                }
            }
        });
    });
});

router.post('/generateToken', checkAuth, function (req, res, _next) {
    if (!req.body.email) {
        return res.status(401).json({
            message: "Error, correo requerido"
        });
    }

    Account.findOne({
        registrationUser: req.body.email,
        active: true
    }).then(account => {
        if (!account) {
            logger.error("Sin resultados para el usuario, favor de revisar");
            return res.status(404).json({
                message: "Sin resultados para el usuario, favor de validar"
            });
        }
        //codificar el correo y el id de la cuenta, generamos token valido por un año
        var token = jwt.sign({
            email: req.body.email,
            idAccount: account._id
        }, process.env.SECRET_WORD_TOKEN_GENERATION, {
            expiresIn: '365d'
        });
        EmailTokens.find({
            user: req.params.email
        }).then(documents => {
            if (documents.length > 0) {
                return res.status(200).json({
                    message: "El usuario ya ha generado un token",
                    code: 'ok'
                });
            }
            const userToken = new EmailTokens({
                token: token,
                user: req.body.email
            });
            userToken.save().then(_doc => {
                return res.status(200).json({
                    message: "Token generado exitosamente",
                    code: 'ok',
                    result: token
                });
            }).catch(err => {
                logger.error("Error al crear nuevo registro de token: " + err);
                return res.status(501).json({
                    message: "Error registrando nuevo token"
                });
            })
        });
    }).catch(err => {
        logger.error("Error generando token: " + err);
        return res.status(404).json({
            message: "Error generando token: " + err
        });
    })
});

router.get('/tokensByUser/:email', checkAuth, function (req, res, _next) {
    if (!req.params.email || req.params.email == '') {
        logger.error("Se requiere el correo electrónico");
        return res.status(403).json({
            message: "Usuario requerido"
        });
    }
    EmailTokens.find({
        user: req.params.email
    }).then(documents => {
        var arrTemp = [];
        documents.forEach((item) => {
            var temp = item.token[0].split('.');
            arrTemp.push({
                id: item._id,
                token: temp[0]
            });
        });
        res.status(200).json({
            message: "Registros obtenidos exitosamente",
            code: 'ok',
            result: arrTemp
        })
    });
});

router.delete('/deleteToken/:id', checkAuth, function (req, res) {
    if (!req.params.id || req.params.id == '') {
        return res.status(401).json({
            message: "Se requiere identificador"
        });
    }

    EmailTokens.deleteOne({
        _id: req.params.id
    }).then(err => {
        logger.info("Token eliminando exitosamente");
        return res.status(200).json({
            message: "El token se elimino existosamente",
            code: 'ok'
        });
    })
});

router.post('/changePassword', function (req, res) {
    if (!req.body.email || !req.body.password) {
        logger.error("Parametros incompletos, favor de validar");
        return res.status(401).json({
            message: "Parámetros incompletos, correo o contraseña"
        });
    }
    try {
        User.findOne({
            email: req.body.email
        }).then(user => {
            if (!user) {
                return res.status(400).json({
                    message: 'El usuario solicitado no existe'
                });
            }
            bcrypt.hash(req.body.password, 10).then(hash => {
                user.password = hash;
                user.save((err) => {
                    if (err) throw "Error al cambiar la contraseña. Error: " + err;
                    logger.info("Contraseña modificada exitosamente");
                    logger.info("Enviando correo a: " + req.body.email);
                    const msg = {
                        to: req.body.email,
                        subject: 'Aviso de cambio de contraseña',
                        text: 'Cambio de contraseña',
                        html: `<p>Hola ${user.username}, recientemente cambiaste tu contraseña. Gracias por utilizar nuestros servicio</p>`
                    };
                    mail.sendEmail(msg);
                    return res.status(200).json({
                        message: "Contraseña modificada exitosamente",
                        code: 'ok'
                    });
                });
            });
        });
    } catch (e) {
        logger.error(e);
        return res.status(500).json({
            message: "Error actualizando la contraseña",
            err: e
        });
    }
});

module.exports = router;