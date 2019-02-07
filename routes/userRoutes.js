const express = require('express');
const constants = require('../commons/Constants');
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post('/iniciarSesion', function (req, res, next) {
    let fetchedUser;
    User.find({ email: req.body.email }).then(user => {
        if (!user) {
            return res.status(401).json({
                message: "La autenticación falló"
            });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user[0].password);
    }).then(result => {
        if (!result) { 
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
            token: token
        })
    }).catch(err => {
        return res.status(401).json({
            message: "La autenticación falló",
            err: err
        });
    });
});

router.post('/registrar', function(req, res, next) {
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
            });
            console.log(err);
        });
    });
});

module.exports = router;