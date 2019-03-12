/* General constants */
const SERVER_PORT = '8999';
const DATABASE_URL_CONNECTION = 'mongodb://127.0.0.1:27017/mailServices';
const SECRET_WORD = 'auschwitz_birkenau';
const SECRET_WORD_TOKEN_GENERATION = 'auschwitz_birkenau_and_dachau';
const SENDGRID_API_KEY = 'SG.v4H7QiauSmqWD - YpNXEUeQ.bemv28uYdNavvtJTqHG0 - V1PpFjUMQGCoV_tbu1F1io';
const MONGO_STRING_CONNECTION = 'mongodb+srv://maildevelop:maildevelop@clustermailservice-ofo7q.gcp.mongodb.net/mailServices';

module.exports = {
    SERVER_PORT: SERVER_PORT,
    DATABASE_URL_CONNECTION: DATABASE_URL_CONNECTION,
    SECRET_WORD: SECRET_WORD,
    SECRET_WORD_TOKEN_GENERATION: SECRET_WORD_TOKEN_GENERATION,
    SENDGRID_API_KEY: SENDGRID_API_KEY,
    MONGO_STRING_CONNECTION: MONGO_STRING_CONNECTION
}