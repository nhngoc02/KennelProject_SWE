const Transaction = require('../db_modules/transaction')

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


module.exports = {
    getTrans,
    getTranById,
    updateTransaction
  
}