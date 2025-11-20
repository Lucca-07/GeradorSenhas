const express = require("express");
const router = express.Router();

const UserController = require("../controllers/auth.controller");

router.get("/api/allusers", UserController.index);
router.get("/api/user", UserController.read);

router.post("/api/user", UserController.create);

router.put("/api/user", UserController.update);

router.delete("/api/user", UserController.delete);

module.exports = router;
