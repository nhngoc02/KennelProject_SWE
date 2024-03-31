const { Int32 } = require("mongodb");
const mongoose = require("mongoose");
require("dotenv").config({path:'../data.env'});


const DATABASE_URL = process.env.DATABASE_URL;
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.connect(DATABASE_URL, CONFIG);

mongoose.connection
    .on("open", () => {
        console.log("Connected to Mongoose");

        // Call the function with your collection name
        const collectionName = 'client';
    })
    .on("close", () => console.log("Disconnected from Mongoose"))
    .on("error", (error) => console.log(error));

module.exports = mongoose;
