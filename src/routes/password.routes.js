const express = require("express");
const router = express.Router();

const PasswordController = require("../controllers/password.controller");
const PasswordMiddleware = require("../middlewares/password.middleware");
const UserMiddleware = require("../middlewares/auth.middleware");

router.get("/api/allpasswords", PasswordController.index);
router.get(
    "/api/passwords/user/:id",
    UserMiddleware.validateId,
    PasswordController.readByUser
);
router.get(
    "/api/password/pass/:id",
    PasswordMiddleware.validateId,
    PasswordController.readById
);

router.post(
    "/api/password",
    PasswordMiddleware.validateCreate,
    PasswordMiddleware.validatePasswordFrom,
    PasswordController.create
);

router.post(
    "/api/password/generate",
    PasswordMiddleware.validatePasswordFrom,
    PasswordMiddleware.validateGenerate,
    PasswordController.createAndSave
);

router.put(
    "/api/password/:id",
    PasswordMiddleware.validateId,
    PasswordController.update
);

router.delete(
    "/api/password/:id",
    PasswordMiddleware.validateId,
    PasswordController.delete
);

module.exports = router;
