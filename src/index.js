const express = require("express");
const app = express();
const connectDB = require("./config/database");
connectDB;

const router = require("./routes");
app.use(express.json());
app.use(router);

app.listen(1111, () => {
    console.log("✅ Server up and running on: http://localhost:1111");
});
