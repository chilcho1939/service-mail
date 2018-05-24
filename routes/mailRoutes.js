var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

// let smtpConfig = {
//     host: 'smtp.example.com',
//     port: 587,
//     secure: false, // upgrade later with STARTTLS
//     auth: {
//         user: 'username',
//         pass: 'password'
//     }
// };
// service: 'gmail',
// auth: {
//   user: 'chilcho1939@gmail.com',
//   pass: '01049119391945Gil'
// }

router.get('/saludar', (req, res) => {
    console.log('Me la pelan turistas');
    res.status(200).json({
      message: 'success'
    });
});

router.get('/sendMail', (req, res) => {
    var transporter = nodemailer.createTransport({
        host: 'smtp.betostrucking.com',
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
            user: 'ventas@betostrucking.com',
            pass: '05*Abril/2018'
        }
      });
      
      var mailOptions = {
        from: 'ventas@betostrucking.com',
        to: 'ventas@betostrucking.com',
        subject: req.body.subject,
        text: req.body.message
      };
            
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).json({
            message: 'success'
            , obj: info.response
          });
        }
      });
});

module.exports = router;