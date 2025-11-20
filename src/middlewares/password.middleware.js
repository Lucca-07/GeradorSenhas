const { validate: isUuid, v4: uuid } = require("uuid");
const Password = require("../models/password.model");
const User = require("../models/user.model");

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

    async validatePasswordFrom(req, res, next) {
        const { owner_name, from } = req.body;
        try {
            const password = await Password.findOne({ owner_name, from });
            if (password) {
                return res.status(401).json({
                    message:
                        "You already have a password from this app / website.",
                });
            }
            next();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async validateCreate(req, res, next) {
        const { owner_name, from, pass } = req.body;

        if (!owner_name || !from || !pass) {
            return res
                .status(400)
                .json({ error: "Missing owner_name or from or pass!" });
        }

        try {
            const user = await User.findOne({ name: owner_name });
            if (!user) {
                return res
                    .status(400)
                    .json({ error: "This user does not exists!" });
            }
            const password = new Password({
                _id: uuid(),
                owner_name,
                from,
                pass,
            });
            req.password = password;
            next();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async validateGenerate(req, res, next) {
        const { owner_name, from, length, uppercase, numbers, special } = req.body;

        if (!owner_name || !from || !length) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        try {
            const user = await User.findOne({ name: owner_name });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            let chars = "abcdefghijklmnopqrstuvwxyz";
            if (uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            if (numbers) chars += "0123456789";
            if (special) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

            let generatedPassword = "";
            for (let i = 0; i < length; i++) {
                generatedPassword += chars.charAt(Math.floor(Math.random() * chars.length));
            }

            const password = new Password({
                _id: uuid(),
                owner_name: user.name,
                from,
                pass: generatedPassword,
            });

            req.password = password;
            req.generatedPassword = generatedPassword;
            next();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
};
