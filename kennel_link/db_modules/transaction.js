const mongoose = require("../database");

/*Creates a schema for the transaction to create and 
fetch data from transaction collection in database*/

const transaction = new mongoose.Schema( {
    TID : Number,
    clientID : Number,
    reservationID : Number,
    totalAmount_usd : Number,
    transactionDate : Date,
    activeFlag : Boolean,
    modifiedDate : Date,
    createTime: Date
    },
    {
      timestamps : true,
      collection: 'transaction' // Specify the collection name
    }
)

const Transaction = mongoose.model("transaction", transaction);

module.exports = Transaction;