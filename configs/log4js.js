const log4js = require('log4js');
var logger = log4js.getLogger();
//en los appenders se pueden agregar mas de un log destino aparte de app
if (process.env.NODE_ENV == 'development') {
    log4js.configure({
        appenders: {
            out: {
                type: 'stdout'
            },
            app: {
                type: 'file',
                filename: __dirname + '/logs/application.log',
                maxLogSize: 20000000,
                backups: 3,
                compress: true
            }
        },
        categories: {
            default: {
                appenders: ['out'],
                level: 'info'
            },
            error: {
                appenders: ['out', 'app'],
                level: 'error'
            }
        }
    });
} else { 
    log4js.configure({
        appenders: {
            out: {
                type: 'stdout'
            },
            app: {
                type: 'file',
                filename: __dirname + '/logs/application.log',
                maxLogSize: 20000000,
                backups: 3,
                compress: true
            }
        },
        categories: {
            default: {
                appenders: ['app'],
                level: 'error'
            }
        }
    });
}


module.exports = logger;