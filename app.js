// app.js
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError")
const passport = require("passport");
const LocalStrategy = require("passport-local")
const session = require("express-session");
const flash = require("connect-flash");
const User = require("./models/user.js")


const userRoutes = require('./routes/user');
const dashboardRoutes = require('./routes/dashboard');

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

// Middleware for logging request time
app.use((req, res, next) => {
    req.responseTime = new Date(Date.now()).toString();
    console.log(req.method, req.path, req.responseTime, req.hostname);
    next();
});

// Middleware for setting locals
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Use Routes
app.use(userRoutes); // For user-related routes
app.use(dashboardRoutes); // For dashboard-related routes

// Unwanted route
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"))
});

// Error handling
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong!"} = err
    res.status(statusCode).render("error.ejs", { message })
});

app.listen(port, () => {
    console.log("App listening on port " + port);
});
