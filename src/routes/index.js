const express = require("express");
const router = express.Router();

const userRouter = require("./auth.routes");
const passwordRouter = require("./password.routes");

router.use(userRouter);
router.use(passwordRouter);

module.exports = router;
