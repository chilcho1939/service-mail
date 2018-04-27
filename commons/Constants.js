/* General constants */
const CONFIG_DATA_CONNECTION = {
    userName: 'userdba',
    password: 'rE?E8U2H_pr?pHaq',
    server: '52.204.186.106',
    database: 'ST_CAD_SON_DEMO_QA',
    options: {
        connectTimeout: 30000,
        database: 'ST_CAD_SON_DEMO_QA',
        port: 1599,
        requestTimeout: 15000,
        rowCollectionOnDone: false,
        rowCollectionOnRequestCompletion: true,
        useColumnNames: true
    }
};
const SERVER_PORT = '3001';
/* queries */
const ALL_PHONES_CATALOG = 'SELECT * FROM C_Telefono';

module.exports = {
    CONFIG_DATA_CONNECTION: CONFIG_DATA_CONNECTION,
    ALL_PHONES_CATALOG: ALL_PHONES_CATALOG,
    SERVER_PORT: SERVER_PORT
}