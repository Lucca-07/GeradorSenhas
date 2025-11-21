const User = require("../models/user.model");
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");

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
        try {
            await req.user.save();
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
        const { login, pass, name } = req.body;
        try {
            req.user.login = login;
            req.user.pass = pass;
            req.user.name = name;
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

    async login(req, res) {
        try {
            const token = jwt.sign(
                { login: req.login },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h",
                }
            );
            return res.status(200).json({ user: req.user, token: token });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
};
