const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    username: { type: String, required: false },
    password: { type: String, required: true },
    mail: { type: String, required: true, unique: true },
    address: { type: Map, of:String, required: false }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);