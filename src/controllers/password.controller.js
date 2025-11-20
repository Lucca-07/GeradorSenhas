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
        const { login } = req.body;

        if (!login) {
            return res.status(400).json({ error: "Missing login!" });
        }
        try {
            const user = await User.findOne({ login: login });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            const username = user.name;
            const passes = await Password.find({ owner_name: username });

            return res.status(200).json({ passwords: passes });
        } catch (error) {}
    },

    async update(req, res) {
        const { _id, newowner, newfrom, newpass } = req.body;
        if (!_id) {
            return res.status(400).json({ error: "Missing id!" });
        }
        if (!newowner || !newpass || !newfrom) {
            return res
                .status(400)
                .json({ error: "Missing new owner, new from or new pass!" });
        }
        try {
            const updated = await Password.findOneAndUpdate(
                { _id },
                { owner_name: newowner, from: newfrom, pass: newpass },
                { new: true }
            );
            if (!updated) {
                return res.status(404).json({ error: "Password not found" });
            }
            return res
                .status(200)
                .json({ message: "Password updated successfully!" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async delete(req, res) {
        const { owner, from } = req.body;
        if (!owner || !from) {
            return res.status(400).json({ error: "Missing owner or from!" });
        }
        try {
            const deleted = await Password.deleteOne({
                owner_name: owner,
                from: from,
            });
            if (deleted.deletedCount === 0) {
                return res.status(404).json({ error: "Password not found" });
            }
            return res
                .status(200)
                .json({ message: "Password deleted successfully!" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
};
