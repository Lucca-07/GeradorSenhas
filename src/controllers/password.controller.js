const Password = require("../models/password.model");
const User = require("../models/user.model");
const { v4: uuid } = require("uuid");

module.exports = {
    async index(req, res) {
        try {
            const passwords = await Password.find();
            return res.status(200).json({ passwords: passwords });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async create(req, res) {
        try {
            await req.password.save();
            return res
                .status(201)
                .json({ message: "Password created successfully!" });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },

    async readByUser(req, res) {
        try {
            const username = req.user.name;
            const passes = await Password.find({ owner_name: username });

            return res.status(200).json({ passwords: passes });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async readById(req, res) {
        try {
            const id = req.password._id;
            const pass = await Password.findOne({ _id: id });

            return res.status(200).json({ password: pass });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        const { owner_name, from, pass } = req.body;
        try {
            req.password.owner_name = owner_name;
            req.password.from = from;
            req.password.pass = pass;
            await req.password.save();

            return res.json({ message: "Password updated successfully" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            await req.password.deleteOne();
            return res
                .status(200)
                .json({ message: "Password deleted successfully." });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async createAndSave(req, res) {
        try {
            await req.password.save();
            return res.status(201).json({
                message: "Password generated and saved!",
                password: req.generatedPassword,
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },
};
