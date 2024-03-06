const express = require('express')
const methodOverride = require("method-override");
const mongoose = require("./database");
const Client = require("./db_modules/client")
const Employee = require("./db_modules/employee")

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

async function authenticate(name, pass, user_type) {
  if(user_type = 'client') {
    const username = await Client.find({client_username: name}) 
    if() {

    }
  } else if(user_type = 'employee') {
    const username = await Employee.find({emp_username: name})

  }
}

app.get('/', (req, res) => {
  console.log("Displaying homepage")
  res.render('pages/homepage')
})

app.get("/signup", (req, res) => {
  res.render("pages/signup");
})

app.get("/login", (req,res) => {
  res.render("pages/login");
})

app.post("/login", async (req,res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const user_type = req.body.user_type;
    authenticate(username, password, user_type);

  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

app.get("/home", (req,res) => {
  res.render("pages/client_dash")
})


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`));