const mongoose = require("../database");

/*Creates a schema for the employee to create and 
fetch data from employee collection in database*/
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

/* restore if necessary.
const employee = new mongoose.Schema({
    empID: Number,
    empFN : String,
    empLN : String,
    empEmail : String,
    empPhone : String,
    // empStartDate : { type: Date, default: Date.now },
    empStartDate : { type: Date },
    activeFlag : Boolean,
    // modifiedDate : Int32,
    modifiedDate : {type: [Date, Number]},
    emp_username : String,
    emp_password : String,
    createTime: Date
    },
    {
    timestamps : true
    }, {
      collection: 'employee' // Specify the collection name
  });

const Employee = mongoose.model("employee", employee);

module.exports = Employee;

*/
// MARCO Adjusted employee schema

const employee = new mongoose.Schema({
    empID: Number,
    empFN: String,
    empLN: String,
    empEmail: String,
    empPhone: String,
    empStartDate: Date,
    activeFlag: Boolean,
    modifiedDate: Number,
    emp_username: String,
    emp_password: String,
    createTime: Date
}, {
    timestamps: true,
    collection: 'employee' // Specify the collection name
});

const Employee = mongoose.model("employee", employee);

module.exports = Employee;
