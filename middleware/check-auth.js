const jwt = require("jsonwebtoken");
const constants = require("../commons/Constants");

module.exports = (req, res, next) => {
    try {
        console.log("entre a la verificacion")
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, constants.SECRET_WORD);
        req.userData = {
            email: decodedToken.email,
            userId: decodedToken.userId
        };
        next();
    } catch (err) {
        res.status(401).json({
            message: "La autenticación falló",
            err: err
        });
    }

}