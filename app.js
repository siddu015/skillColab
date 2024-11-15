const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const User = require("./models/user");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");

const port = 3000;
const MONGO_URL = "mongodb://127.0.0.1:27017/skillColab";

main().then(() => {
    console.log("Connected to DB.");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "DevaraIsDagad",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    req.responseTime = new Date(Date.now()).toString();
    console.log(req.method, req.path, req.responseTime, req.hostname);
    next();
});

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/", (req, res) => {
    res.send("I'm groot");
});

app.get("/register", (req, res) => {
    res.render("users/register");
});

app.post("/register", async (req, res) => {
    const { firstName, lastName, email, username, phoneNo, skills, role, password, confirmPassword, status } = req.body;

    const existingUserByEmail = await User.findOne({ email });
    const existingUserByUsername = await User.findOne({ username });
    const existingUserByPhoneNo = await User.findOne({ phoneNo });

    if (existingUserByEmail) {
        return res.send("Email already in use. Please try another.");
    }
    else if (existingUserByUsername) {
        return res.send("Username already taken. Please try another.");
    }
    else if (existingUserByPhoneNo) {
        return res.send("Phone-no already in use. Please try another.");
    }

    if (password !== confirmPassword) {
        return res.send("Passwords do not match. Please try again.");
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
        res.send("Registration successful!");
    } catch (err) {
        console.log(err);
        res.send("Error registering user.");
    }
});

app.get("/login", (req, res) => {
    res.render("users/login");
});

app.post("/login", passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {});

app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect("/login");
    });
});

app.listen(port, () => {
    console.log("App listening on port " + port);
});
