const mongoose = require("mongoose");

const passwordSchema = mongoose.Schema({
    _id: { type: String, required: true },
    owner_name: { type: String, required: true, ref: "users" },
    from: { type: String, required: true },
    pass: { type: String, required: true },
});

module.exports = mongoose.model("passwords", passwordSchema);
