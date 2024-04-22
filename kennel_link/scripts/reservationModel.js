const Kennel = require('../db_modules/kennel')
const Reservation = require('../db_modules/reservation')
const Client = require("../db_modules/client")
const Pet = require('../db_modules/pet')

async function getKennelIds() {
    let kennelIds = []
    const kennel_records = await Kennel.find()
    kennel_records.forEach(function(record){
        kennelIds.push(record.KID);
    });
    return kennelIds;
}

// send in a date range which will give a number of available slots --> if value is non-zero then can make a reservation
async function getNumAvailable(start, end) {
    const overlappingCount = await Reservation.countDocuments({
        $or: [
            {
                arrivalDate: { $lt: departureDate },
                departureDate: { $gt: arrivalDate }
            },
            {
                arrivalDate: { $gte: arrivalDate, $lte: departureDate }
            },
            {
                departureDate: { $gte: arrivalDate, $lte: departureDate }
            }
        ]
    });
    return overlappingCount;
}

// returns an array of the kennel IDs taken during a given time, if none are available will return an empty array
async function getAvailability(start, end) {
    let all_kennels = getKennelIds();
    let taken = [];
    const res_taken = await Reservation.find({
        $or: [
            {
                arrivalDate: { $lt: end },
                departureDate: { $gt: start }
            },
            {
                arrivalDate: { $gte: start, $lte: end }
            },
            {
                departureDate: { $gte: start, $lte: end }
            }
        ]
    });

    // curerently gives an array of those taken during the time --> need those NOT taken 
    res_taken.forEach(function(record){
        taken.push(record.kennelID)
    });

    let available = (await all_kennels).filter( (elem) => !taken.includes(elem))
    return available;
}

async function getNextRID() {
    try {
        const maxRes = await Reservation.find().sort({ RID: -1 }).limit(1);
        const maxID = (maxRes[0]?.RID || 0) +1;
        return maxID;
    } catch(error) {
        console.error("Error calculating next RID:", error);
        throw error;
    }
}

async function findPetID(petName, ownerID) {
    const pet = await Pet.findOne({ownerID: ownerID, petName: petName});
    console.log("Pet ID: ", pet.petID)
    const petID = pet.petID;
    return petID;
}

async function findOwnerID(clientFirst, clientLast) {
    const owner = await Client.findOne({clientFN: clientFirst, clientLN: clientLast})
    console.log("Client ID:", owner.clientID)
    const clientID = owner.clientID;
    return clientID;
}

// adds a provided reservation if the there is/are kennel slot(s) open during the timeframe
async function addReservationWithCheck(ownerFN, ownerLN, pet_name, arrival, departure, emp_id) {
    try {
        const available_kennels = await getAvailability(arrival, departure)
        console.log(available_kennels)
        const ownerID = await findOwnerID(ownerFN, ownerLN);
        const resID = await getNextRID();
        const resPetID = await findPetID(pet_name, ownerID);
        if(available_kennels === undefined || available_kennels.length == 0) {
            console.log("No available kennels");
            return false; 
        }
        const newRes = new Reservation({
            RID : resID,
            clientID :  ownerID,
            petID : resPetID,
            arrivalDate : arrival,
            departureDate : departure,
            kennelID : available_kennels[0],
            empID : emp_id,
            createTime : new Date(),
            activeFlag : true,
            modifiedDate: 0,
        });
        console.log("Reservation: ", newRes)
        console.log("Got new Reservation here")
        await newRes.save();
        console.log("Saved new reservation")
        return true;
    } catch(error) {
        console.error("Unable to add reservation:", error);
        return false;
    }
}

async function editRes(ID, arrival, depart) {
    try {
      const result = await Reservation.updateOne({ RID: ID }, { arrivalDate: arrival, departureDate: depart });
      if (result.nModified === 0) {
        // If no records were modified, the client was not found
        console.log("Reservation Not Found");
        return false;
      } else {
        console.log("Reservation Updated Successfully")
        return true;
      }
    } catch(error) {
      console.log("Reservation Not Found", error);
      return false;
    }
}

async function cancelRes(ID) {
    try {
        const result = await Reservation.updateOne({ RID: ID }, {$set: {activeFlag: false} });
        if (result.nModified === 0) {
            console.log("Reservation Not Found");
            return false;
          } else {
            console.log("Reservation Updated Successfully")
            return true;
          }
        } catch(error) {
          console.log("Reservation Not Found", error);
          return false;
        }
}



async function editRes(ID, arrival, depart) {
    try {
      const result = await Reservation.updateOne({ RID: ID }, { arrivalDate: arrival, departureDate: depart });
      if (result.nModified === 0) {
        // If no records were modified, the client was not found
        console.log("Reservation Not Found");
        return false;
      } else {
        console.log("Reservation Updated Successfully")
        return true;
      }
    } catch(error) {
      console.log("Reservation Not Found", error);
      return false;
    }
}

async function cancelRes(ID) {
    try {
        const result = await Reservation.updateOne({ RID: ID }, {$set: {activeFlag: false} });
        if (result.nModified === 0) {
            console.log("Reservation Not Found");
            return false;
          } else {
            console.log("Reservation Updated Successfully")
            return true;
          }
        } catch(error) {
          console.log("Reservation Not Found", error);
          return false;
        }
}

async function getRes(start, end, user_type, client_id) {
    if(user_type=='Client') {
      try {
        const res_records = await Reservation.find({clientID: client_id, activeFlag: true}).sort({arrivalDate: -1}).skip(start-1).limit(end);
        return res_records;
      } catch(error) {
          console.error("Error returning reservation information:", error);
          throw error;
      }
    }
    if(user_type=='Employee') {
      try {
        const res_records = await Reservation.find({activeFlag: true}).sort({arrivalDate: -1}).skip(start-1).limit(end);
        return res_records;
      } catch(error) {
          console.error("Error returning reservation information:", error);
          throw error;
      }
    }
  
};

async function getResById(res_id) {
  try {
    console.log(res_id)
    const res_record = await Reservation.findOne({RID: res_id});
    if (!res_record) {
      console.log("Reservation ID undefined");
    }
    return res_record;
  } catch(error) {
      console.error("Error returning reservation information:", error);
      throw error;
  }
};

module.exports = {
    addReservationWithCheck,
    getRes,
    getResById,
    editRes,
    cancelRes
}
