const {Int32} = require("mongodb");
const mongoose = require("../database");

/*Creates a schema for the reservation to create and 
fetch data from reservation collection in database*/
const reservation = new mongoose.Schema( {
    RID : Int32,
    clientID : Int32,
    petID : Int32,
    arrivalDate : Date,
    departureDate : Date,
    kennelID : Int32,
    empID : Int32,
    createTime : { type: Date, default: Date.now },
    activeFlag : Boolean,
    modifiedDate : Int32
    },
    {
        timestamps : true
    }
)

const Reservation = mongoose.model("reservation", reservation);

module.exports = Reservation;