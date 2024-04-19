const express = require('express')
const methodOverride = require("method-override");
const mongoose = require("./database");
const client = require('./scripts/clientModel')
const Employee = require('./db_modules/employee')
const pet = require('./scripts/petModel')
const Transaction = require('./db_modules/transaction')
const session = require('express-session')
const reservation = require("./scripts/reservationModel")
const signup_login = require("./scripts/signupLoginModel")

let livereload = require("livereload");
let connectLiveReload = require("connect-livereload");
const Client = require('./db_modules/client');

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

require("dotenv").config({path:'../data.env'});

const app = express()

app.set('view engine', 'ejs')
app.use(connectLiveReload());
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static("static"));
app.use('/styles', express.static('./styles'));
app.use(session({
  secret: 'edliweflaiuehf389dixkxsozdj9w209228', 
  resave: false,
  saveUninitialized: false
}));

app.get('/', (req, res) => {
  res.render('pages/homepage')
})

app.get("/login", (req,res) => {
  res.render("pages/login", {message: ""});
})

app.post("/login", async (req,res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const user_type = req.body.user_type;
    const result = await signup_login.authenticateLogin(username, password, user_type)
    if(result.worked === true) {
      req.session.user = result.response
      req.session.type = user_type
      res.render("pages/dashboard", {user: result.response, type: user_type})
    } else {
      res.render("pages/login", {message: result.message})
    }
  } catch (error) {
    res.status(500).json({message: error.message}); 
      }
})

app.get("/signup", (req, res) => {
  res.render("pages/signup", {message: ""});
})

app.post("/signup", async (req, res) => {
  try {
    // Extract signup data from the request body
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const phone = req.body.phone;
    const username = req.body.username;
    const password = req.body.password;
    const user_type = req.body.user_type;

    const uniqueEmpUsernameCheck = await Employee.findOne({ emp_username: username });
    const uniqueClientUsernameCheck = await Client.findOne({ client_username: username });
    const uniqueEmpEmailCheck = await Employee.findOne({ empEmail: email });
    const uniqueClientEmailCheck = await Client.findOne({ clientEmail: email });
    const uniqueEmpPhoneCheck = await Employee.findOne({empPhone: phone});
    const uniqueClientPhoneCheck = await Employee.findOne({clientPhone: phone});

    if ((!uniqueEmpUsernameCheck) && (!uniqueClientUsernameCheck) && (!uniqueEmpEmailCheck) && (!uniqueClientEmailCheck) && (!uniqueClientPhoneCheck) && (!uniqueEmpPhoneCheck)) {
      if (user_type === 'employee') {
        // If the user type is employee
        signup_login.addEmployee(first_name, last_name, email, phone, username, password);
        res.redirect('/login');
      } else if (user_type === 'client') {
        // If the user type is client
        signup_login.addClient(first_name, last_name, email, phone, username, password);
        res.redirect('/login');
      } else {
        // If the user type is neither client nor employee
        throw new Error("Invalid user type selected");
      }
    } else {
      // If any of the data points are not unique, throw an error
      if (uniqueClientEmailCheck || uniqueEmpEmailCheck !== null){
        errorMsg = "Email is already in use";
        throw new Error (errorMsg);
       
        /*res.render("pages/signup",{message: "Email is already in use"})*/
      }
      else if (uniqueClientPhoneCheck || uniqueEmpPhoneCheck !== null){
        errorMsg = "Phone is already in use";
        throw new Error (errorMsg);
      }
      else{
        errorMsg = "Username is already in use";
        throw new Error(errorMsg);
        /*res.render("pages/signup",{message: "Username is already in use"})*/
      }
    }
  } catch (error) {
    // Handle any errors that occur during the signup process
    console.error(errorMsg, error);
    /*res.status(500).send(errorMsg);*/
    res.render("pages/signup",{message: errorMsg})
  }
});


app.get("/logout", (req,res) => {
  req.session.destroy();
  res.redirect("/login")
})

app.get("/dashboard", (req,res) => {
  const user = req.session.user
  const type = req.session.type
  if(user) {
    res.render("pages/dashboard", {user: user, type: type})
  } else {
    res.redirect("/login")
  }
})

app.get("/reservations", (req,res) => {
  const user = req.session.user
  const user_type = req.session.type
  
  if(user) {
    res.render("pages/reservations", {user: user, type: user_type})
  } else {
    res.redirect("/login")
  }
})

app.get("/res_add", (req,res) => {
  try {
    const user = req.session.user
    const user_type = req.session.type
    if(user) {
    res.render("pages/res_add", {user: user, type: user_type, message: ""})
    } else {
    res.redirect("/login") 
    }
  } catch (error) {
    console.log("The error is: " + error)
    res.redirect("/login")
  }
})

app.post("/res_add", async (req,res) => {
  const user = req.session.user;
  const user_type = req.session.type;
  if(user) {
    const first = req.body.client_fn;
    const last = req.body.client_ln;
    const pet = req.body.pet_name;
    const arrival = req.body.arrival_date;
    const departure = req.body.end_date;
    const emp_id = req.body.emp_id;
    const worked = await reservation.addReservationWithCheck(first, last, pet, arrival, departure, emp_id)
    if(worked) {
      res.render("pages/res_add", {user: user, type: user_type, message: "Reservation Added"})
    } else {
      res.render("pages/res_add", {user: user, type: user_type, message: "Error: Unable to add Reservation"})
    }
  } else {
    res.redirect("/login")
  }
});

app.get("/clients", (req,res) => {
  const user = req.session.user
  const user_type = req.session.type
  if(user) {
    res.render("pages/emp_clients", {type: user_type});
  } else {
    res.redirect("/login")
  }
})

app.get("/pets", (req,res) => {
  const user = req.session.user;
  const user_type = req.session.type; 
  if(user) {
    res.render("pages/pets", {user: user, type: user_type});
  } else {
    res.redirect("/login")
  }
  
});

app.get("/transactions", (req,res) => {
  const user = req.session.user;
  const user_type = req.session.type; 
  if(user) {
    res.render("pages/transactions", {user: user, type: user_type});
  } else {
    res.redirect("/login")
  }
  
});

 app.get("/add_pets", async (req,res) => {
  try {
    // Fetch clients for populating owner options in the form
    const clients = await Client.find();
    const user = req.session.user;
    const user_type = req.session.type;
    res.render("pages/add_pets", { user, type: user_type, clients });
} catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).send("Internal Server Error");
}
});

app.post("/add_pets", async (req, res) => {
  try {
    // Extract pet data from the request body
    const { petName, petType, petBreed, petSex, petDOB, petWeight, ownerID } = req.body;
    
    // Create a new pet document
    const newPet = new Pet({
        petName,
        petType,
        petBreed,
        petSex,
        petDOB,
        petWeight,
        ownerID
    });

    // Save the new pet to the database
    await newPet.save();

    // Redirect to a success page or render a success message
    res.render("pages/add_pet_success", { pet: newPet });
} catch (error) {
    console.error("Error adding pet:", error);
    res.status(500).send("Internal Server Error");
}
});
// app.get("/emp_pets", (req,res) => {
//   res.render("pages/emp_pets");
// })

// app.get("/emp_transactions", (req,res) => {
//   res.render("pages/emp_transactions")
// })

app.get("/emp_employees", (req,res) => {
  res.render("pages/emp_employees")
})

// app.get("/emp_clients_search", (req,res) => {
  //   res.render("pages/emp_clients_search")
// })

// app.get("/emp_clients_edit", (req,res) => {
//   res.render("pages/emp_clients_edit")
// })

app.get("/emp_reservation_add", (req,res) => {
  res.render("pages/emp_res_add")
})

app.get("/emp_reservation_edit", (req,res) => {
  res.render("pages/emp_res_edit")
})

app.get("/emp_reservation_search", (req,res) => {
  res.render("pages/emp_res_search")
})

app.get("/emp_pets_edit", (req,res) => {
  res.render("pages/emp_pets_edit")
})

app.get("/emp_transactions_search", (req,res) => {
  res.render("pages/emp_transactions_search")
})

app.get("/emp_transactions_edit", (req,res) => {
  res.render("pages/emp_transactions_edit")
})

// app.get("/emp_clients_search", async (req,res) => {
//   try {
//     const result = await getClients(1, 5);
//     // res.render("pages/emp_clients_search", {clients: result})
//     // console.log(result);
//     res.render("pages/emp_clients_search", {clients: result})
//   } catch (error) {
//     res.status(500).json({message: error.message});
//     res.redirect('/emp_clients')
//   }
// })

async function getNextID() {
    try {
        // Find the maximum employee ID
        const maxEmployee = await Employee.find().sort({ empID: -1 }).limit(1);

        // Find the maximum client ID
        const maxClient = await Client.find().sort({ clientID: -1 }).limit(1);

        // Determine the maximum ID from both collections
        const maxID = Math.max((maxClient[0]?.clientID || 0), (maxEmployee[0]?.empID || 0)) + 1;

        return maxID;
    } catch (error) {
        console.error("Error calculating next empID:", error);
        throw error;
    }
}

async function getClients(start, end) {
  try {
    const clients = await Client.find().sort({clientLN:1}).skip(start-1).limit(end);
    return clients;
  } catch(error) {
      console.error("Error returning client information:", error);
      throw error;
  }
}

let currentPage = 1;
const pageSize = 10;

app.get("/emp_clients_search", async (req,res) => {
  try {
    const result = await client.getClients(currentPage, pageSize);
    res.render("pages/emp_clients_search", { clients: result, currentPage });
  } catch (error) {
    res.status(500).json({ message: error.message });
    res.redirect('/emp_clients');
  }
});

app.get("/emp_clients_search/next", async (req, res) => {
  currentPage+=pageSize;
  res.redirect('/emp_clients_search');
});

app.get("/emp_clients_search/previous", async (req, res) => {
  if (currentPage > 1) {
    currentPage-=pageSize;
  }
  res.redirect('/emp_clients_search');
});

app.get("/emp_clients_edit", async (req, res) => {
  const clientId = req.query.clientId;
  try {
    const found_client = await client.getClientById(parseInt(clientId)); // Fetch the client data
    if (!found_client) {
      return res.status(404).send("Client not found");
    }
    res.render("pages/emp_clients_edit", { found_client: found_client }); // Pass the client data to the template
  } catch (error) {
    console.error("Error fetching client data:", error);
    res.status(500).send("Internal Server Error");
  }
});

pet.getPets(1, 5)
  .then(pets => {
    console.log("Fetched pets");
  })
  .catch(error => {
    console.error("Error fetching pets:", error);
  });
// Delete client
app.post("/delete_client/:clientID", async (req, res) => {
  const clientID = req.params.clientID;

  try {
    // Delete the client from the database
    const result = await Client.deleteOne({ clientID });

    if (result.deletedCount === 0) {
      // If no records were deleted, the client was not found
      return res.status(404).send("Client not found");
    }

    // Client deleted successfully
    res.status(200).send("Client deleted successfully");
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Update client information
app.post("/update_client/:clientID", async (req, res) => {
  const clientID = req.params.clientID;
  const { clientFN, clientLN, clientEmail, clientPhone } = req.body;

  try {
    // Update the client information in the database
    const result = await Client.updateOne({ clientID }, { clientFN, clientLN, clientEmail, clientPhone });

    if (result.nModified === 0) {
      // If no records were modified, the client was not found
      return res.status(404).send("Client not found");
    }

    // Client updated successfully
    res.status(200).send("Client updated successfully");
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).send("Internal Server Error");
  }
});

async function getPets(start, end, user_type, owner_id) {
  if(user_type=='Client') {
    try {
      const pet_records = await Pet.find({ownerID: owner_id}).sort({petName:1}).skip(start-1).limit(end);
      return pet_records;
    } catch(error) {
        console.error("Error returning client information:", error);
        throw error;
    }
  }
  if(user_type=='Employee') {
    try {
      const pet_records = await Pet.find().sort({petName:1}).skip(start-1).limit(end);
      return pet_records;
    } catch(error) {
        console.error("Error returning client information:", error);
        throw error;
    }
  }

};

let currentPage_pets = 1;
const pageSize_pets = 10;

app.get("/pets_search", async (req,res) => {
  const user_type = req.session.type;

  if(user_type == 'Employee') {
    try {
    const pet_records = await getPets(currentPage_pets, pageSize_pets, user_type, '');
    const ownerIDs = pet_records.map(pet => pet.ownerID);
    const pet_owners = await Client.find({ clientID: { $in: ownerIDs } });
    const pet_owners_name = pet_owners.map(pet_owner => `${pet_owner.clientFN} ${pet_owner.clientLN}`);

    res.render("pages/pets_search", { pets: pet_records, owner_names: pet_owners_name, currentPage_pets, type: user_type});
    } catch (error) {
      res.status(500).json({ message: error.message });
      res.redirect('/pets');
    }
  }
  else if(user_type == 'Client') {
    const owner_id = parseInt(req.session.user.clientID);
    const pet_records = await getPets(currentPage_pets, pageSize_pets, user_type, owner_id);
    res.render("pages/pets_search", { pets: pet_records, currentPage_pets, type: user_type});

  }
  else {}
});

app.get("/pets_search/next", async (req, res) => {
  currentPage_pets+=pageSize_pets;
  res.redirect('/pets_search');
});

app.get("/pets_search/previous", async (req, res) => {
  if (currentPage_pets > 1) {
    currentPage_pets-=pageSize_pets;
  }
  res.redirect('/pets_search');
});

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

app.get("/pets_edit", async (req, res) => {
  const petId = req.query.petId;
  try {
    const found_pet = await getPetById(parseInt(petId)); // Fetch the client data
    if (!found_pet) {
      return res.status(404).send("Pet not found");
    }
    res.render("pages/pets_edit", { found_pet: found_pet }); // Pass the client data to the template
  } catch (error) {
    console.error("Error fetching pet data:", error);
    res.status(500).send("Internal Server Error");
  }
});


// Delete client
app.post("/delete_pet/:petID", async (req, res) => {
  const petID = req.params.petID;

  try {
    // Delete the client from the database
    const result = await Pet.deleteOne({ petID });

    if (result.deletedCount === 0) {
      // If no records were deleted, the client was not found
      return res.status(404).send("Pet not found");
    }

    // Client deleted successfully
    res.status(200).send("Pet deleted successfully");
  } catch (error) {
    console.error("Error deleting pet:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Update pet information
app.post("/update_pet/:petID", async (req, res) => {
  const petID = req.params.petID;
  const { petName, petType, petBreed, petSex, petDOB, petWeight } = req.body;

  try {
    // Update the pet information in the database
    const result = await Pet.updateOne({ petID }, { petName, petType, petBreed, petSex, petDOB, petWeight });

    if (result.nModified === 0) {
      // If no records were modified, the client was not found
      return res.status(404).send("Pet not found");
    }

    // Pet updated successfully
    res.status(200).send("Pet updated successfully");
  } catch (error) {
    console.error("Error updating pet:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/emp_pets_search", async (req,res) => {
  try {
    const { searchQuery } = req.query; // Extract search query from request query parameters
    let pets = []
    if (searchQuery) {
      // If there's a search query, fetch pets based on the query
      pets = pet.petSearch(searchQuery)
    }
    // Render the page with the fetched pets
    res.render("pages/emp_pets_search", { pets, searchQuery });
  } catch (error){}});


async function getTrans(start, end, user_type, client_id) {
  if(user_type=='Client') {
    try {
      const trans_records = await Transaction.find({clientID: client_id}).sort({transactionDate: -1}).skip(start-1).limit(end);
      return trans_records;
    } catch(error) {
        console.error("Error returning transaction information:", error);
        throw error;
    }
  }
  if(user_type=='Employee') {
    try {
      const trans_records = await Transaction.find().sort({transactionDate: -1}).skip(start-1).limit(end);
      return trans_records;
    } catch(error) {
        console.error("Error returning transactioin information:", error);
        throw error;
    }
  }

  }});


let currentPage_trans = 1;
const pageSize_trans = 10;

app.get("/transactions_search", async (req,res) => {
  const user_type = req.session.type;

  if(user_type == 'Employee') {
    try {
    const trans_records = await getTrans(currentPage_trans, pageSize_trans, user_type, '');
    const clientIDs = trans_records.map(tran => tran.clientID);
    const trans_clients = await Client.find({ clientID: { $in: clientIDs } });
    const trans_clients_name = trans_clients.map(trans_client => `${trans_client.clientFN} ${trans_client.clientLN}`);

    res.render("pages/transactions_search", { trans: trans_records, client_names: trans_clients_name, currentPage_trans, type: user_type});
    } catch (error) {
      res.status(500).json({ message: error.message });
      res.redirect('/transactions');
    }
  }
  else if(user_type == 'Client') {
    try {
      const client_id = parseInt(req.session.user.clientID);
      const client_record = await getClientById(client_id);
      const clientName = `${client_record.clientFN} ${client_record.clientLN}`;
      const trans_records = await getTrans(currentPage_trans, pageSize_trans, user_type, client_id);

      res.render("pages/transactions_search", { trans: trans_records, client_name: clientName, currentPage_trans, type: user_type});
      } catch (error) {
        res.status(500).json({ message: error.message });
        res.redirect('/transactions');
      }
    }
  // else {}
});

app.get("/transactions_search/next", async (req, res) => {
  currentPage_trans+=pageSize_trans;
  res.redirect('/transactions_search');
});

app.get("/transactions_search/previous", async (req, res) => {
  if (currentPage_trans > 1) {
    currentPage_trans-=pageSize_trans;
  }
  res.redirect('/transactions_search');
});

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
}

app.get("/transactions_edit", async (req, res) => {
  const transId = req.query.TID;
  try {
    const found_trans = await getTranById(parseInt(transId)); // Fetch the client data
    const clientName = req.query.client;
    if (!found_trans) {
      return res.status(404).send("Transaction not found");
    }
    res.render("pages/transactions_edit", { found_trans: found_trans , client_name: clientName}); // Pass the client data to the template
  } catch (error) {
    console.error("Error fetching transaction data:", error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT;
module.exports = app;
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`));