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
  }

  async function getClients(start, end) {
    try {
      const clients = await Client.find().sort({clientLN:1}).skip(start-1).limit(end-start+1);
      // console.log(clients.length);
      // console.log(clients.type); // undefined
      // console.log(clients);
      return clients;
    } catch(error) {
        console.error("Error returning client information:", error);
        throw error;
    }
  }

  module.exports = {
    getClientById,
    getClients
  }