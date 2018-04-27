var express = require("express");
var logger = require("moragan");
var path = require("path");
var bodyParser = require("body-parser");
var cookierParser = require("cookie-parser");
var app = express();

var index = require('./routes/index');
var appRoutes = require('./routes/appRoutes');

/** Configuración de la vista */
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs');

app.use('/node_modules', express.static(__dirname + '/node_modules'));

/**Agregando nuestro proyecto angular */
app.use('/', express.static(__dirname + '/public/app'));

/**Cachando url's de angular */
app.all(/^\/$/, (req, res) => {
    res.redirect('/');
});

app.use('/', (req,res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended = false
}));
app.use(cookierParser());
app.use(express.static(path.join(__dirname, '/public')));

//This block is for avoid any CORS(Cross Origin RequestS) erros
//Request coming from different origin than the server
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

//API's
app.use('/', index);

// error handlers
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    return res.render('error');
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;