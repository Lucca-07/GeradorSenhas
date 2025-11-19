const express = require("express");
const router = express.Router();

const UserController = require("../controllers/auth.controller");

router.get("/api/allusers", UserController.index);
router.get("/api/users", UserController.read);

router.post("/api/users", UserController.create);

router.put("/api/users", UserController.update);

router.delete("/api/users", UserController.delete);

module.exports = router;
