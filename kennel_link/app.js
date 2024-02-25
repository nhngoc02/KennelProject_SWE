const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('pages/index')
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