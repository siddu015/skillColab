// controllers/user.js
const User = require("../models/user");
const passport = require("passport");
const ExpressError = require("../utils/ExpressError");

module.exports.renderLoginPage = (req, res) => {
    res.render("users/login");
};

module.exports.loginUser = passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
});

module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/login");
    });
};

module.exports.renderRegisterPage = (req, res) => {
    res.render("users/register");
};

module.exports.registerUser = async (req, res) => {
    const { firstName, lastName, email, username, phoneNo, skills, role, password, confirmPassword, status } = req.body;

    const existingUserByEmail = await User.findOne({ email });
    const existingUserByUsername = await User.findOne({ username });
    const existingUserByPhoneNo = await User.findOne({ phoneNo });

    if (existingUserByEmail) {
        req.flash("error", "Email already in use. Please try another.");
        return res.redirect("/register");
    } else if (existingUserByUsername) {
        req.flash("error", "Username already taken. Please try another.");
        return res.redirect("/register");
    } else if (existingUserByPhoneNo) {
        req.flash("error", "Phone-no already in use. Please try another.");
        return res.redirect("/register");
    }

    if (password !== confirmPassword) {
        req.flash("error", "Passwords do not match. Please try again.");
        return res.redirect("/register");
    }

    try {
        const newUser = new User({
            firstName,
            lastName,
            email,
            username,
            phoneNo,
            skills: skills.split(",").slice(0, 25),
            role,
            status: status === 'on' ? true : false,
        });

        await User.register(newUser, password);
        req.flash("success", "Registration successful! Please log in.");
        res.redirect("/login");
    } catch (err) {
        console.log(err);
        req.flash("error", "Error registering user.");
        res.redirect("/register");
    }
};

module.exports.renderProfilePage = (req, res) => {
    const currUser = req.user; // Assuming user is logged in and stored in session
    res.render('users/profile', { currUser });
};
