const User = require("../models/user.model");
const { v4: uuid } = require("uuid");

module.exports = {
    async index(req, res) {
        try {
            const users = await User.find();
            return res.status(200).json({ users: users });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async create(req, res) {
        const { login, pass } = req.body;

        if (!login || !pass) {
            return res.status(400).json({ error: "Missing login or pass!" });
        }

        const user = new User({
            _id: uuid(),
            login: login,
            pass: pass,
        });

        try {
            await user.save();
            return res
                .status(201)
                .json({ message: "User created succesfully!" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async read(req, res) {
        const { login } = req.body;
        if (!login) {
            return res.status(400).json({ error: "Missing login!" });
        }
        try {
            const user = await User.findOne({ login });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(200).json({ user });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        const { login, newlogin, newpass } = req.body;
        if (!login) {
            return res.status(400).json({ error: "Missing login!" });
        }
        if (!newlogin || !newpass) {
            return res
                .status(400)
                .json({ error: "Missing new login or new pass!" });
        }
        try {
            const updated = await User.findOneAndUpdate(
                { login },
                { login: newlogin, pass: newpass },
                { new: true }
            );
            if (!updated) {
                return res.status(404).json({ error: "User not found" });
            }
            return res
                .status(200)
                .json({ message: "User updated successfully!" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async delete(req, res) {
        const { login } = req.body;
        if (!login) {
            return res.status(400).json({ error: "Missing login!" });
        }
        try {
            const deleted = await User.deleteOne({ login });
            if (deleted.deletedCount === 0) {
                return res.status(404).json({ error: "User not found" });
            }
            return res
                .status(200)
                .json({ message: "User deleted successfully!" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
};
