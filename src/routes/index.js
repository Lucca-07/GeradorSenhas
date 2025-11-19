const express = require("express");
const router = express.Router();

const testeRouter = require("./teste.routes");
const userRouter = require("./auth.routes");

router.use(testeRouter);
router.use(userRouter);

module.exports = router;
