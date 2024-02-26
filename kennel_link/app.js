const express = require('express')
const morgan = require("morgan");
const methodOverride = require("method-override");
//const mongoose = require("./database");
const app = express()
require("dotenv").config({path:'../data.env'});

app.set('view engine', 'ejs')

app.use(morgan("tiny"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static("static"));
app.use('/styles', express.static('./styles'));


// app.get('/', (req, res) => {
//     res.render('pages/index')
// })

app.get('/', (req, res) => {
    res.render('pages/homepage')
})

app.get("/", (req, res) => {
    res.render("index.ejs", { greeting: "Hello" });
});

app.get("/clientReservation", (req, res) => {
    res.render("ClientReservation.ejs")
})

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`));