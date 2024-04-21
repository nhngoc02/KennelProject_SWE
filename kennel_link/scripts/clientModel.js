const Client = require("../db_modules/client")

// gets a singular client with the matching ID
async function getClientById(client_id) {
    try {
      const client_record = await Client.findOne({clientID: client_id});
      if (!client_record) {
        console.log("clientID undefined");
      }
      // const client_record = await Client.find({clientID: client_id});
      return client_record;
    } catch(error) {
        console.error("Error returning client information:", error);
        throw error;
    }
};

async function getAllClients(start, end) {
  try {
    const clients = await Client.find().sort({clientLN:1}).skip(start-1).limit(end-start+1);
    return clients;
  } catch(error) {
      console.error("Error returning client information:", error);
      throw error;
  }
}

// gets a list of clients when given a list of IDs
async function getClientsByID(clientIDs) {
  const clients = await Client.find({ clientID: { $in: clientIDs } , activeFlag:true});
  return clients;
}

module.exports = {
  getClientById,
  getClientsByID,
  getAllClients
}