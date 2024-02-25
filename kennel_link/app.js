const express = require('express')
const morgan = require("morgan");
const methodOverride = require("method-override");
const mongoose = require("./database");
const Todo = require("./todoModel");
const app = express()
const port = 3000

app.set('view engine', 'ejs')

app.use(morgan("tiny"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static("static"));


app.get('/', (req, res) => {
    res.render('pages/index')
})

app.get('/home', (req, res) => {

})
app.listen(port, () => {
  console.log(`App listening at port ${port}`)
})
var connection = require('./database').databaseConnection;
app.get('/inventory', (req, res) => {
    let sql = 'SELECT * FROM inventory';
    connection.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Inventory received');
    });
});


app.get("/", (req, res) => {
    res.render("index.ejs", { greeting: "Hello" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`));