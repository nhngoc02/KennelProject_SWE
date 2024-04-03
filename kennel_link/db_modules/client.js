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

//Marco adjusted client schema
const client = new mongoose.Schema({
    clientID: Number,
    clientFN : String,
    clientLN : String,
    clientEmail : String,
    clientPhone : String,
    createTime : Date,
    activeFlag : Boolean,
    modifiedDate : Number,
    client_username : String,
    client_password : String,
    
    },
    {
    timestamps : true,
    collection: 'client'
    }
)

const Client = mongoose.model("client", client);

module.exports = Client;

