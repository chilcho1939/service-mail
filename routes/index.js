var express = require("express");
var router = express.Router();

/* Load inex.html */
router.get('/', (req, res) => {
    res.sendfile('./public/index.html');
});

module.exports = router;