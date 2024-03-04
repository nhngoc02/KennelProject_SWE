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

        // Function to print keys (columns) for a collection
        async function printCollectionKeys(collectionName) {
            try {
                const keys = await mongoose.connection.db.collection(collectionName).findOne();
                console.log(`Keys for collection ${collectionName}:`);
                for (let key in keys) {
                    console.log(key);
                }
            } catch (error) {
                console.error("Failed to print collection keys:", error);
            }
        }

        // Call the function with your collection name
        const collectionName = 'client';
        printCollectionKeys(collectionName);
    })
    .on("close", () => console.log("Disconnected from Mongoose"))
    .on("error", (error) => console.log(error));

module.exports = mongoose;


