const {Int32, Double } = require("mongodb");
const mongoose = require("../database");

/*Creates a schema for the employee to create and 
fetch data from employee collection in database*/
const employee = new mongoose.Schema({
    empFN : String,
    empLN : String,
    empEmail : String,
    empPhone : String,
    empStartDate : { type: Date, default: Date.now },
    activeFlag : Boolean,
    modifiedDate : Int32,
    emp_username : String,
    emp_password : String
    },
    {
    timestamps : true
    }
)

const Employee = mongoose.model("employee", employee);

module.exports = Employee;