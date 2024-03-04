const {Int32, Double } = require("mongodb");
const mongoose = require("../database");

/*Creates a schema for the kennel to create and 
fetch data from kennel collection in database*/
const kennel = new mongoose.Schema({
    KID : Int32,
    occupiedFlag : Boolean,
    areaSF : Double,
    activeFlag : Boolean,
    modifiedDate : Int32,
    },
    {
    timestamps : true
    }
)

const Kennel = mongoose.model("kennel", kennel);

module.exports = Kennel;