const {Int32} = require("mongodb");
const mongoose = require("../database");

/*Creates a schema for the transaction to create and 
fetch data from transaction collection in database*/
/*
[
  {
    name: 'transaction',
    type: 'collection',
    options: {
      validator: {
        '$jsonSchema': {
          bsonType: 'object',
          required: [ 'clientID', 'reservationID', 'totalAmount_usd' ],
          properties: {
            TID: { bsonType: 'int' },
            clientID: { bsonType: 'int' },
            reservationID: { bsonType: 'int' },
            totalAmount_usd: { bsonType: 'double' },
            transactionDate: { bsonType: 'date' },
            activeFlag: { bsonType: 'bool' },
            modifiedDate: { bsonType: 'date' }
          }
        }
      }
    },
    info: {
      readOnly: false,
      uuid: new UUID("40407ca8-2884-4791-9fd0-34edddd54a92")
    },
    idIndex: { v: 2, key: { _id: 1 }, name: '_id_' }
  }
]
*/

const transaction = new mongoose.Schema( {
    TID : Int32,
    clientID : Int32,
    reservationID : Int32,
    totalAmount_usd : Int32,
    transactionDate : Date,
    activeFlag : Boolean,
    modifiedDate : {type: [Date, Int32]},
    createTime: Date
    },
    {
        timestamps : true
    }
)

const Transaction = mongoose.model("transaction", transaction);

module.exports = Transaction;

db.pet.updateMany({}, { $set: { createTime: new Date() } } );