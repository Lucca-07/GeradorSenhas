const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    login: { type: String, required: true },
    pass: { type: String, required: true },
});

module.exports = mongoose.model("user", userSchema);
