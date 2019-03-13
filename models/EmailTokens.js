const mongoose = require('mongoose');
const emailTokens = mongoose.Schema({
    token: { type: Array, default: [], required: false},
    user: {type: String, required: false}
});

module.exports = mongoose.model("EmailTokens", emailTokens);
