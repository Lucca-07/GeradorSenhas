const mongoose = require("mongoose");
require("dotenv").config();

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Conectado ao mongoDB");
    } catch (error) {
        console.log("❌ Erro ao conectar ao mongoDB" + error);
    }
}

module.exports = connectDB();
