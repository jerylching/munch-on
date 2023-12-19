const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user.controllers");

router.route("/").get(UserController.getAllUsers);
router.route("/register").post(UserController.register);
router.route("/delete").delete(UserController.deleteUser);
router.route("/login").post(UserController.logIn);
router.route("/:id").put(UserController.updateUser);

module.exports = router;
