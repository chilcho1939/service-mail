var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

router.get('api/sendMail', (req, res) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'chilcho1939@gmail.com',
          pass: '01049119391945Gil'
        }
      });
      
      var mailOptions = {
        from: 'chilcho1939@gmail.com',
        to: 'ing.gildardomercado@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
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