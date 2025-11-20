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
        const { name, login, pass } = req.body;

        if (!name || !login || !pass) {
            return res
                .status(400)
                .json({ error: "Missing name, login or pass!" });
        }

        const user = new User({
            _id: uuid(),
            name: name,
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
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Missing id!" });
        }
        try {
            
            return res.status(200).json({ user: req.user });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const updates = {};
            if (req.body.name) updates.name = req.body.name;
            if (req.body.login) updates.login = req.body.login;
            if (req.body.pass) updates.pass = req.body.pass;

            Object.assign(req.user, updates);
            await req.user.save();

            return res.json({ message: "User updated successfully" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            await req.user.deleteOne();
            return res
                .status(200)
                .json({ message: "User deleted successfully." });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
};
