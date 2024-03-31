const {Int32, Double } = require("mongodb");
const mongoose = require("../database");

/*Creates a schema for the pet to create and 
fetch data from pet collection in database*/
/*
[
  {
    name: 'pet',
    type: 'collection',
    options: {
      validator: {
        '$jsonSchema': {
          bsonType: 'object',
          required: [ 'ownerID', 'petName', 'petType', 'petSex' ],
          properties: {
            petID: { bsonType: 'int' },
            ownerID: { bsonType: 'int' },
            petName: { bsonType: 'string', minLength: 1 },
            petType: { bsonType: 'string', minLength: 1 },
            petBreed: { bsonType: 'string' },
            petSex: { bsonType: 'string', enum: [Array] },
            petDOB: { bsonType: 'string' },
            petWeight: { bsonType: 'string' },
            activeFlag: { bsonType: 'bool' },
            modifiedDate: { bsonType: [Array] }
          }
        }
      }
    },
    info: {
      readOnly: false,
      uuid: new UUID("5d32ec47-1edf-481f-a6af-462b931e13a4")
    },
    idIndex: { v: 2, key: { _id: 1 }, name: '_id_' }
  }
]
*/
const pet = new mongoose.Schema({
    petID: Number,
    ownerID: Number,
    petName: String,
    petType: String,
    petBreed: String,
    petSex: { type: String, enum: ["M", "F"] },
    petDOB: String,
    petWeight: String,
    activeFlag: Boolean,
    modifiedDate : {type: [Date, Number]},
    createTime: Date
    },
    {
    timestamps : true
    }
)

const Pet = mongoose.model('Pet', pet);

module.exports = Pet;