const express = require("express");
const router = express.Router();

const PasswordsController = require("../controllers/password.controller");

router.get("/api/allpasswords", PasswordsController.index);
router.get("/api/passwords", PasswordsController.read);

router.post("/api/password", PasswordsController.create);

router.put("/api/password", PasswordsController.update);

router.delete("/api/password", PasswordsController.delete);

module.exports = router;
