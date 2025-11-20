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
        const { owner_name, from, pass } = req.body;

        if (!owner_name || !from || !pass) {
            return res
                .status(400)
                .json({ error: "Missing owner_name or from or pass!" });
        }

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
        try {
            await password.save();
            return res
                .status(201)
                .json({ message: "Password created succesfully!" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async read(req, res) {
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({ error: "Missing _id!" });
        }
        try {
            const user = await User.findOne({ _id: _id });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            const username = user.name;
            const passes = await Password.find({ owner_name: username });

            return res.status(200).json({ passwords: passes });
        } catch (error) {}
    },

    async update(req, res) {
        try {
            const updates = {};
            if (req.body.from) updates.from = req.body.from;
            if (req.body.pass) updates.pass = req.body.pass;
            
            if (req.body.owner_name) {
                const user = await User.findOne({ name: req.body.owner_name });
                if (!user) {
                    return res.status(404).json({ error: "Owner not found" });
                }
                updates.owner_name = user.name;
            }

            Object.assign(req.password, updates);
            await req.password.save();
            
            return res.json({ message: "Password updated successfully" });
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
