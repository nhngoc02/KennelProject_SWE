const mongoose = require("../database");

/*Creates a schema for the client to create and 
fetch data from client collection in database*/
/*
[
  {
    name: 'client',
    type: 'collection',
    options: {
      validator: {
        '$jsonSchema': {
          bsonType: 'object',
          required: [
            'clientFN',
            'clientLN',
            'client_username',
            'client_password'
          ],
          properties: {
            clientID: { bsonType: 'int' },
            clientFN: { bsonType: 'string', minLength: 1 },
            clientLN: { bsonType: 'string', minLength: 1 },
            clientEmail: { bsonType: 'string' },
            clientPhone: { bsonType: 'string' },
            createTime: { bsonType: 'date' },
            activeFlag: { bsonType: 'bool' },
            modifiedDate: { bsonType: [Array], minimum: 0 },
            client_username: { bsonType: 'string', minLength: 1 },
            client_password: { bsonType: 'string', minLength: 1 }
          }
        }
      }
    },
    info: {
      readOnly: false,
      uuid: new UUID("749899ff-b7a0-41d4-8653-3815696e8f0c")
    },
    idIndex: { v: 2, key: { _id: 1 }, name: '_id_' }
  }
]
*/
const client = new mongoose.Schema({
    clientID: {type: Number},
    clientFN : String,
    clientLN : String,
    clientEmail : String,
    clientPhone : String,
    // createTime : { type: Date, default: Date.now }, 
    createTime : Date,
    activeFlag : Boolean,
    // modifiedDate : Number,
    modifiedDate : {type: [Date, Number]},
    client_username : String,
    client_password : String
    },
    {
    timestamps : true
    }
)

const Client = mongoose.model("client", client);

module.exports = Client;