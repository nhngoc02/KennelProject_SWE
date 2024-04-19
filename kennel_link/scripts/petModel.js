
const showAllPetsBtn = document.getElementById('showAllPetsBtn');

showAllPetsBtn.addEventListener('click', async () => {
    try {
      // Fetch all pets from the server
      const response = await fetch('/all_pets');
      const pets = await response.json();

      // Get the table body element
      const tbody = document.querySelector('#petsTable tbody');

      // Clear existing table rows
      tbody.innerHTML = '';

      // Populate the table with pet data
      pets.forEach(pet => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${pet.petName}</td>
          <td>${pet.clientName}</td>
          <td>${pet.petType}</td>
          <td>${pet.petBreed}</td>
          <td><a href="/emp_pets_edit">Edit</a></td>
        `;
        tbody.appendChild(row);
      });

      // Show the table
      document.getElementById('petsTable').style.display = 'block';
    } catch (error) {
      console.error('Error fetching all pets:', error);
    }
});

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