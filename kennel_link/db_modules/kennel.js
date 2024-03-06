const {Int32, Double } = require("mongodb");
const mongoose = require("../database");

/*Creates a schema for the kennel to create and 
fetch data from kennel collection in database*/
/*
[
  {
    name: 'kennel',
    type: 'collection',
    options: {
      validator: {
        '$jsonSchema': {
          bsonType: 'object',
          required: [ 'occupiedFlag' ],
          properties: {
            KID: { bsonType: 'int' },
            occupiedFlag: { bsonType: 'bool' },
            areaSF: { bsonType: 'double' },
            activeFlag: { bsonType: 'bool' },
            modifiedDate: { bsonType: [Array] }
          }
        }
      }
    },
    info: {
      readOnly: false,
      uuid: new UUID("3d0d824e-f9d8-4975-8d3f-a437bd8f2c1e")
    },
    idIndex: { v: 2, key: { _id: 1 }, name: '_id_' }
  }
]
*/
const kennel = new mongoose.Schema({
    KID : Int32,
    occupiedFlag : Boolean,
    areaSF : Double,
    activeFlag : Boolean,
    modifiedDate : {type: [Date, Int32]},
    createTime: Date
    },
    {
    timestamps : true
    }
)

const Kennel = mongoose.model("kennel", kennel);

module.exports = Kennel;