const express = require("express");
const router = express.Router();

const UserController = require("../controllers/auth.controller");
const UserMiddleware = require("../middlewares/auth.middleware");

router.get("/api/allusers", UserController.index);
router.get("/api/user/:id", UserMiddleware.validateId, UserController.read);

router.post(
    "/api/user",
    UserMiddleware.validateLoginExists,
    UserMiddleware.validateCreate,
    UserController.create
);

router.put(
    "/api/user/:id",
    UserMiddleware.validateId,
    UserMiddleware.validateLoginExists,
    UserController.update
);

router.delete(
    "/api/user/:id",
    UserMiddleware.validateId,
    UserController.delete
);

module.exports = router;
