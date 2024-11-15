const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require('../middleware');
const userController = require("../controllers/user");

router.route("/login")
    .get(wrapAsync(userController.renderLoginPage))
    .post(userController.loginUser);

router.get("/logout", (userController.logoutUser));

router.route("/register")
    .get(wrapAsync(userController.renderRegisterPage))
    .post((userController.registerUser));

router.get("/profile", wrapAsync(userController.renderProfilePage));

module.exports = router;
