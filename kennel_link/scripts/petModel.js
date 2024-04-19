const Pet = require("../db_modules/pet")
async function getPets(start, end){
  try{
    const pets = await Pet.find().sort({petName: 1}).skip(start -1).limit(end - start+1);
    return pets;
  } catch(error){
    console.error("Error returning pet information:", error);
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

module.exports = {
  petSearch,
  getPets
}