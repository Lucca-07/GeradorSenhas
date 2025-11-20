const { validate: isUuid } = require("uuid");
const Password = require("../models/password.model");

module.exports = {
    async validateId(req, res, next) {
        const { id } = req.params;

        if (!isUuid(id)) {
            return res.status(400).json({ error: "Invalid ID." });
        }

        try {
            const password = await Password.findById(id);
            if (!password) {
                return res.status(404).json({ error: "Password not found." });
            }
            req.password = password;
            next();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
};
