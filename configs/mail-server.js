const nodemailer = require('nodemailer');
const Account = require('../models/Account');
const logger = require('./log4js');
var transporter;
var memoryAccount;

const mailActions = {
    connect: function () { 
        Account.findOne({
                registrationUser: process.env.EMAIL
            }).then(account => {
            memoryAccount = account;
            transporter = nodemailer.createTransport({
                host: account.host,
                port: account.port,
                secure: false,
                auth: {
                    user: account.sourceMail,
                    pass: account.password
                },
                tls: {
                    rejectUnauthorized: account.tls
                }
            });
        });
    }, 
    sendEmail: function (mailObject) {
        var mailOptions = {
            from: memoryAccount.sourceMail,
            to: mailObject.to,
            subject: mailObject.subject,
            html: mailObject.html
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                logger.error("Error al enviar el correo: " + error);
                return false;
            } else {
                logger.info("Correo envíado: " + info.response);
                return true;
            }
        });
    }
};

module.exports = mailActions;