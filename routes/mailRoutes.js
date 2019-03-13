const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const logger = require('../configs/log4js');
const User = require('../models/User');
const Account = require('../models/Account');
const EmailTokens = require('../models/EmailTokens');
const jwt = require('jsonwebtoken');

router.get('/saludar', (req, res) => {
    res.status(200).json({
        message: 'servicio arriba'
    });
});
router.post('/sendMail', (req, res) => {
    /* Validaciones */
    if (!req.body.email) {
        logger.error("Parámetros requeridos, (correo electrónico requerido)");
        return res.status(401).json({
            message: "Error, correo electrónico requerido"
        });
    }

    if (!req.body.subject || req.body.subject == '' || !req.body.message || req.body.message == '') {
        logger.error("Se necesita el asunto y el contenido del mensaje");
        return res.status(401).json({
            message: 'Error, parametros incompletos (asunto y mensaje)'
        });
    }
    /* Validaciones */
    /* Buscando usuario en base de datos*/
    User.findOne({
        email: req.body.email,
        active: true
    }).then(user => {
        if (!user) {
            logger.error("Usuario no registrado");
            return res.status(404).json({
                message: "No existe usuario vinculado. No es posible enviar el correo, operación no permitida."
            });
        }
        //buscar token asociado a la cuenta
        EmailTokens.findOne({
            user: req.body.email
        }).then(emailToken => {
            if (!emailToken) { 
                logger.error("No existe token asociado a la cuenta");
                return res.status(404).json({
                    message: "No existe token asociado a la cuenta"
                });
            }
            const token = emailToken.token[0];
            var decodedToken;
            try {
                decodedToken = jwt.verify(token, process.env.SECRET_WORD_TOKEN_GENERATION);
            } catch (e) {
                logger.error("Error decodificando el token: " + e);
            }

            //buscar cuenta activa con datos del token
            Account.findOne({
                _id: decodedToken.idAccount,
                active: true
            }).then(document => {
                var transporter = nodemailer.createTransport({
                    host: document.host,
                    port: document.port,
                    secure: false,
                    auth: {
                        user: document.sourceMail,
                        pass: document.password
                    },
                    tls: {
                        rejectUnauthorized: document.tls
                    }
                });
                var mailOptions = {
                    from: document.sourceMail,
                    to: document.deliveryMail,
                    cc: [document.ccMail],
                    subject: req.body.subject,
                    html: req.body.message
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        logger.error("Error al enviar el correo: " + error);
                        res.status(500).json({
                            message: 'Error, no se pudo enviar el correo',
                            error: error
                        });
                    } else {
                        logger.info("Correo envíado: " + info.response);
                        return res.status(200).json({
                            message: 'Correo envíado exitosamente',
                            obj: info.response
                        });
                    }
                });
            }).catch(err => {
                logger.error("Error buscando token: " + err);
                return res.status(500).json({
                    message: "Error buscando token: " + err
                });
            });

        }).catch(err => {
            logger.error("Error buscando la cuenta: " + err);
            return res.status(500).json({
                message: "Error buscando la cuenta: " + err
            });
        })
    }).catch(err => {
        logger.error("Error buscando al usuario: " + err)
        return res.status(500).json({
            message: "Error buscando la usuario: " + err
        });
    });
});
module.exports = router;