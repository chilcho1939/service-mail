const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
    host: { type: String, required: true },
    port: { type: String, required: true },
    sourceMail: { type: String, required: true },
    password: { type: String, required: true },
    deliveryMail: { type: String, required: true },
    ccMail: { type: String, required: false },
    registrationDate: { type: Date, required: true },
    registrationUser: { type: String, required: true },
    updateDate: { type: Date, required: true },
    updateUser: { type: String, required: true },
    active: { type: Boolean, required: true}
});

module.exports = mongoose.model("Account", accountSchema);
