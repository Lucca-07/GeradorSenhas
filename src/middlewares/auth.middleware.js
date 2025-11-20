const { validate: isUuid, v4: uuid } = require("uuid");
const User = require("../models/user.model");

module.exports = {
    async validateId(req, res, next) {
        const { id } = req.params;

        if (!isUuid(id)) {
            return res.status(400).json({ error: "Invalid ID." });
        }

        try {
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }
            req.user = user;
            next();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async validateLoginExists(req, res, next) {
        const { login } = req.body;
        try {
            const user = await User.findOne({ login });
            if (user) {
                return res
                    .status(401)
                    .json({ message: "This user login already exists." });
            }
            next();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async validateCreate(req, res, next) {
        const { name, login, pass } = req.body;

        if (!name || !login || !pass) {
            return res
                .status(400)
                .json({ error: "Missing name, login or pass!" });
        }

        try {
            const user = new User({
                _id: uuid(),
                name: name,
                login: login,
                pass: pass,
            });
            req.user = user;
            next();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
};
