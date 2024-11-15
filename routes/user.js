// routes/user.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../middleware');
const { registerUser, loginUser, logoutUser, renderRegisterPage, renderLoginPage, renderProfilePage } = require('../controllers/user');

// User Routes
router.get("/login", renderLoginPage);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/register", renderRegisterPage);
router.post("/register", registerUser);
router.get("/profile", isLoggedIn, renderProfilePage);

module.exports = router;
