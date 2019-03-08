const express = require('express');
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const Account = require('../models/Account');
const logger = require("../configs/log4js");

router.post('/findAllByUser', checkAuth, function (req, res, next) {
    logger.info("Buscando cuentas por usuario");
    Account.find({
        registrationUser: req.body.user
    }).then(results => {
        const records = [];
        if (results.length > 0) {
            logger.debug("Consulta con resultados");
            results.forEach((item) => {
                records.push({
                    id: item._id,
                    host: item.host,
                    port: item.port,
                    sourceMail: item.sourceMail,
                    ccMail: item.ccMail,
                    password: item.password,
                    deliveryMail: item.deliveryMail,
                    active: item.active
                });
            });
            res.status(200).json({
                message: "Registros obtenidos exitosamente",
                code: 'ok',
                result: records
            });
        } else {
            res.status(200).json({
                message: "Sin resultados para tu búsqueda",
                code: 'ok'
            });
            logger.info("Sin resultados para la busqueda");
        }
    }).catch(err => {
        res.status(500).json({
            message: "Error al obtener los registros",
            err: err
        });
        logger.error("Error al obtener los registros por usuario: " + err);
    });
});

router.post('/saveAccount', checkAuth, function (req, res, next) {
    logger.info("Guardando la nueva cuenta");
    try {
        if (!validateData(req.body, 'create')) { 
            logger.error("Parámetros incompletos, favor de veririficar la petición");
            throw "Error, parametros incompletos, favor de veririficar la petición";
        }
    } catch (e) {
        return res.status(500).json({
            message: e
        });
    }
    const account = new Account({
        host: req.body.host,
        port: req.body.port,
        sourceMail: req.body.sourceMail,
        password: hash,
        deliveryMail: req.body.deliveryMail,
        ccMail: req.body.ccMail,
        registrationDate: new Date(),
        registrationUser: req.body.registrationUser,
        updateDate: new Date(),
        updateUser: req.body.updateUser,
        active: true
    });
    account.save().then(result => {
        res.status(201).json({
            message: 'Registro existoso',
            code: 'ok'
        });
        logger.info("Guardado exitoso");
    }).catch(err => {
        res.status(500).json({
            message: 'Error al guardar el registro',
            err: err
        });
        logger.error("Error al guardar la nueva cuenta:" + err);
    });
});

router.post('/updateAccount', checkAuth, function (req, res, next) {
    logger.info("Actualizando información de la cuenta");
    try {
        if (!validateData(req.body, 'update')) throw "Error, parametros incompletos";
    } catch (e) {
        return res.status(401).json({
            message: e
        });
    }
    Account.findById(req.body.id).then((result, err) => {
        if (err) {
            return res.status(404).json({
                message: 'El id proporcionado no existe, favor de revisar',
                err: err
            });
        }
        var object = createObject(req.body);
        Account.findByIdAndUpdate(req.body.id, object, (err) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    message: 'Error al actualizar el registro',
                    err: err
                })
            }
            res.status(200).json({
                message: 'Registro actualizado exitosamente'
            });
        });
    })
});

function createObject(object) {
    return {
        host: object.host,
        password: object.password,
        port: object.port,
        sourceMail: object.sourceMail,
        deliveryMail: object.deliveryMail,
        ccMail: object.ccMail,
        updateUser: object.user,
        active: object.active,
        updateDate: new Date()
    };
}

function validateData(object, distinctive) {
    if (distinctive == 'create') {
        if (!object.host || object.host == '') return false;
        if (!object.port || object.port == '') return false;
        if (!object.sourceMail || object.sourceMail == '') return false;
        if (!object.password || object.password == '') return false;
        if (!object.deliveryMail || object.deliveryMail == '') return false;
        if (!object.user || object.user == '') return false;
        if (object.active == undefined) return false;
        return true;
    } else {
        if (!object.id || object.id == '') return false
        if (!object.host || object.host == '') return false;
        if (!object.port || object.port == '') return false;
        if (!object.sourceMail || object.sourceMail == '') return false;
        if (!object.password || object.password == '') return false;
        if (!object.deliveryMail || object.deliveryMail == '') return false;
        if (!object.user || object.user == '') return false;
        if (object.active == undefined) return false;
        return true;
    }
}

module.exports = router;