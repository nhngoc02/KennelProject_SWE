const express = require('express')
const methodOverride = require("method-override");
//const mongoose = require("./database");

let livereload = require("livereload");
let connectLiveReload = require("connect-livereload");

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

require("dotenv").config({path:'../data.env'});

const app = express()

app.set('view engine', 'ejs')
app.use(connectLiveReload());
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static("static"));
app.use('/styles', express.static('./styles'));

function authenticate(name, pass) {

}

app.get('/', (req, res) => {
    res.render('pages/homepage')
})

app.get("/signup", (req, res) => {
    res.render("pages/signup");
})

app.get("/login", (req,res) => {
    res.render("pages/login");
})
app.post("/login", (req,res) => {

})

app.get("/home", (req,res) => {
  res.render("pages/client_dash")
})


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`));