const express = require("express")
const app = express()
const mongoose = require("mongoose")
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate")

const port = 3000

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, "/public")))


app.get("/", (req, res) => {
    res.send("I'm groot");
})



app.listen(port, () => {
    console.log("App listening on port " + port);
})
