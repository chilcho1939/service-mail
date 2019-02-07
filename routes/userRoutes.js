const express = require('express');
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");

router.get('/iniciarSesion', function (req, res, next) {
    
});

router.post('/registrar', function (req, res, next) {
    bcrypt.hash(req.body.password, 10).then(hash => { 
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            address: req.body.address
        });
        user.save().then(result => { 
            res.status(201).json({
                message: 'Usuario creado exitosamente',
                result: result,
                code: 'ok'
            });
        }).catch(err => { 
            res.status(500).json({
                error: err,
                code: 'error'
            })
        });
    });
});

module.exports = router;