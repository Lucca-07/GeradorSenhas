const express = require("express");
const router = express.Router();

const PasswordsController = require("../controllers/password.controller");
const PasswordMiddleware = require("../middlewares/password.middleware");
const UserMiddleware = require("../middlewares/auth.middleware");

router.get("/api/allpasswords", PasswordsController.index);
router.get(
    "/api/passwords/user/:id",
    UserMiddleware.validateId,
    PasswordsController.readByUser
);
router.get(
    "/api/password/pass/:id",
    PasswordMiddleware.validateId,
    PasswordsController.readById
);

router.post(
    "/api/password",
    PasswordMiddleware.validateCreate,
    PasswordMiddleware.validatePasswordFrom,
    PasswordsController.create
);

router.put(
    "/api/password/:id",
    PasswordMiddleware.validateId,
    PasswordsController.update
);

router.delete(
    "/api/password/:id",
    PasswordMiddleware.validateId,
    PasswordsController.delete
);

module.exports = router;
