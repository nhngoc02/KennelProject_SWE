const Transaction = require('../db_modules/transaction');
const res_model = require("./reservationModel");
let kennel_rate = 35;

async function getTrans(start, end, user_type, client_id) {
    if(user_type=='Client') {
      try {
        const trans_records = await Transaction.find({clientID: client_id, activeFlag: true}).sort({transactionDate: -1}).skip(start-1).limit(end);
        return trans_records;
      } catch(error) {
          console.error("Error returning transaction information:", error);
          throw error;
      }
    }
    if(user_type=='Employee') {
      try {
        const trans_records = await Transaction.find({activeFlag: true}).sort({transactionDate: -1}).skip(start-1).limit(end);
        return trans_records;
      } catch(error) {
          console.error("Error returning transactioin information:", error);
          throw error;
      }
    }
  
};

async function getTranById(trans_id) {
  try {
    const trans_record = await Transaction.findOne({TID: trans_id});
    if (!trans_record) {
      console.log("Transaction ID undefined");
    }
    return trans_record;
  } catch(error) {
      console.error("Error returning transaction information:", error);
      throw error;
  }
};

// Updates transaction --> if successfule will return True else False
async function updateTransaction(tranID, new_amount) {
  try {
  const result = await Transaction.updateOne({TID:tranID},{$set: {totalAmount_usd: new_amount}});
  if(!result) {
    return false;
  }
  return true;
  } catch(error) {
    console.log(error)
    return false;
  }
}

async function getNextTID() {
  try {
      const maxTID = await Transaction.find().sort({ TID: -1 }).limit(1);
      const maxID = (maxTID[0]?.TID || 0) +1;
      return maxID;
  } catch(error) {
      console.error("Error calculating next TID:", error);
      throw error;
  }
}

function calcNumDays(arrival, depart) {
  console.log("Arrival:", arrival, "\nDeparture: ", depart)
  const arrivalDate = new Date(arrival);
  const departureDate = new Date(depart)
  let time_difference = departureDate.getTime() - arrivalDate.getTime();
  let day_difference = Math.round(time_difference / (1000 * 3600 * 24));
  return day_difference;
}

async function makeTransFromRes(clientFN, clientLN, res_id, arrival, departure) {
  try {
    const client_ID = await res_model.findOwnerID(clientFN, clientLN);
    const numDays = calcNumDays(arrival, departure);
    const total = numDays * kennel_rate;
    const newTID = await getNextTID();
    console.log("Got next TID")
    const newTrans = new Transaction({
      TID: newTID,
      clientID: client_ID,
      reservationID: Number(res_id),
      totalAmount_usd: total,
      transactionDate: new Date(),
      activeFlag: true,
      modifiedDate: new Date(),
      createTime: new Date(),
    });
    console.log("Made new Trans: ", newTrans);
    await newTrans.save()
    
    return true;
  } catch(error) {
    console.log("An Error Occurred: ", error)
    return false;
  }
 
  // have to get the clientID
  // calculate the numDays
  // make a new transaction for the res
}

module.exports = {
    getTrans,
    getTranById,
    updateTransaction,
    makeTransFromRes
  
}