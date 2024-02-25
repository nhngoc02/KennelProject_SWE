import { createConnection } from 'mysql2';

require('dotenv').config(); // use npm install for this first

var connection = createConnection({
    host : process.env.DATABASE_HOST,
    user : process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE_NAME
});

connection.connect((err => {
    if(err) throw err;
    console.log('MySQL Connected');
}));

export const databaseConnection = connection;