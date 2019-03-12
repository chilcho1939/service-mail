const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const logger = require('../configs/log4js');
const User = require('../models/User');
const Account = require('../models/Account');
const jwt = require('jsonwebtoken');
const constants = require('../commons/Constants');

router.get('/saludar', (req, res) => {
    res.status(200).json({
        message: 'servicio arriba'
    });
});
router.post('/sendMail', (req, res) => {
    /* Validaciones */
    if (!req.body.email) {
        logger.error("Parámetros requeridos al mandar el correo, (correo electrónico requerido)");
        return res.status(401).json({
            message: "Error, correo electrónico requerido"
        });
    }
    if (!req.body.token) { 
        logger.error("Se necesita token para continuar");
        return res.status(401).json({
            message: "Parámetros requeridos, se necesita token"
        });
    }

    if (req.body.subject == '' || req.body.text == '') {
        logger.error("Se necesita el asunto y el contenido del mensaje");
        return res.status(401).json({
            message: 'Error, parametros incompletos'
        });
    }
    /* Validaciones */
    /* Buscando usuario en base de datos*/
    User.findOne({ email: req.body.email, active: true }).then(user => {
        if (!user) {
            logger.error("Usuario no registrado");
            return res.status(404).json({
                message: "No existe usuario vinculado. No es posible enviar el correo, operación no permitida."
            });
        }
        const token = req.body.token;
        var decodedToken;
        try {
            decodedToken = jwt.verify(token, constants.SECRET_WORD_TOKEN_GENERATION);
        } catch (e) {
            logger.error("Error decodificando el token: " + e);
        }

        //buscar cuenta activa con datos del token
        Account.findOne({ _id: decodedToken.idAccount, active: true }).then(document => {
            var transporter = nodemailer.createTransport({
                host: document.host,
                port: document.port,
                secure: false,
                auth: {
                    user: document.sourceMail, //correo que se autentica
                    pass: document.password
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            var mailOptions = {
                from: document.deliveryMail, //destino
                to: document.sourceMail, //correo que se autentica
                subject: req.body.subject,
                html: req.body.message
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    res.status(500).json({
                        message: 'Error, no se pudo enviar el correo',
                        error: error
                    });
                } else {
                    console.log('Email sent: ' + info.response);
                    res.status(200).json({
                        message: 'success',
                        obj: info.response
                    });
                }
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