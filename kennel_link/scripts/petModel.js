const Pet = require("../db_modules/pet")

async function getPetById(pet_id) {
  try {
    const pet_record = await Pet.findOne({petID: pet_id});
    if (!pet_record) {
      console.log("petID undefined");
    }
    return pet_record;
  } catch(error) {
      console.error("Error returning client information:", error);
      throw error;
  }
}


async function petSearch(searchQuery) {
  let pets = []; // Initialize pets array
  pets = await Pet.find({
    $or: [
      { petName: { $regex: searchQuery, $options: "i" } }, // Search by pet name (case-insensitive)
      { petBreed: { $regex: searchQuery, $options: "i" } }, // Search by pet breed (case-insensitive)
    ],
  }).sort({ petName: 1 }); // Sort pets by petName
  return pets;
}

async function getPets(start, end, user_type, owner_id) {
  if(user_type=='Client') {
    try {
      const pet_records = await Pet.find({ownerID: owner_id, activeFlag: true}).sort({petName:1}).skip(start-1).limit(end);
      return pet_records;
    } catch(error) {
        console.error("Error returning client information:", error);
        throw error;
    }
  }
  if(user_type=='Employee') {
    try {
      const pet_records = await Pet.find({activeFlag: true}).sort({petName:1}).skip(start-1).limit(end);
      return pet_records;
    } catch(error) {
        console.error("Error returning client information:", error);
        throw error;
    }
  }

};

async function updatePet(petID, petName, petType, petBreed, petSex, petDOB, petWeight) {
  const result = await Pet.updateOne({ petID }, { petName, petType, petBreed, petSex, petDOB, petWeight });

  if (result.nModified === 0) {
    // If no records were modified, the client was not found
    console.log("Update unsuccessful");
  }
  return result;
}

module.exports = {
  petSearch,
  getPetById,
  getPets,
  updatePet
}