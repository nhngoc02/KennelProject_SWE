const {Int32} = require("mongodb");
const mongoose = require("../database");

/*Creates a schema for the client to create and 
fetch data from client collection in database*/
const client = new mongoose.Schema({
    clientFN : String,
    clientLN : String,
    clientEmail : String,
    clientPhone : String,
    createTime : { type: Date, default: Date.now },
    activeFlag : Boolean,
    modifiedDate : Int32,
    client_username : String,
    client_password : String
    },
    {
    timestamps : true
    }
)

const Client = mongoose.model("client", client);

module.exports = Client;