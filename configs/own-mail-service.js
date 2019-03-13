const nodemailer = require('nodemailer');

const ownMailer = function (data) {
    var transporter = nodemailer.createTransport({
        host: data.host,
        port: data.port,
        secure: false,
        auth: {
            user: data.sourceMail,
            pass: data.password
        },
        tls: {
            rejectUnauthorized: data.tls
        }
    });
    var mailOptions = {
        from: data.sourceMail,
        to: data.deliveryMail,
        cc: [data.ccMail],
        subject: data.subject,
        html: data.message
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
}

module.exports = ownMailer(data);