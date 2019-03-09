var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
const checkAuth = require("../middleware/check-auth");
const logger = require('log4js');
const User = require("../models/User");

router.get('/saludar', (req, res) => {
    res.status(200).json({
        message: 'servicio arriba'
    });
});
router.post('/sendMail', (req, res) => {
    var transporter = nodemailer.createTransport({
        host: 'mail.betostrucking.com'
        , port: 587
        , secure: false,
        auth: {
            user: 'ventas@betostrucking.com'
            , pass: '05*Abril/2018'
        }, tls: {rejectUnauthorized: false}
    });
    var mailOptions = {
        from: 'contacto@betostrucking.com'
        , to: 'ventas@betostrucking.com'
        , subject: req.body.subject
        , html: req.body.message
    };
    if(req.body.subject == '' || req.body.text == '') {
      res.status(500).json({
        message: 'Error, parametros incompletos'
      });
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.status(500).json({
                message: 'Error, no se pudo enviar el correo',
                error: error
            });
        }
        else {
            console.log('Email sent: ' + info.response);
            res.status(200).json({
                message: 'success'
                , obj: info.response
            });
        }
    });
});

router.put('/activateAccount/:token', checkAuth, function (req, res, next) { 
    //proceso de activacion
    User.findOne({ temporaryToken: req.params.token }, function (req, res) {

    });
})
module.exports = router;