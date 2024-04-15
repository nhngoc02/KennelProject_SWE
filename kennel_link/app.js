  const express = require('express')
const methodOverride = require("method-override");
const mongoose = require("./database");
const Client = require('./db_modules/client')
const Employee = require('./db_modules/employee')
const Pet = require('./db_modules/pet')
const session = require('express-session')

let livereload = require("livereload");
let connectLiveReload = require("connect-livereload");

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

async function authenticate(name, pass, type) {
  if(type === 'Client') {
    const result = await Client.findOne({client_username: name});
    if(!result) {
      return {worked: false, message: "Username not found: Please Try Again", response: result};
    } else {
      if(result.client_password !== pass) {
        return {worked: false, message: "Incorrect Password: Please Try Again", response: result};
      }
      return {worked: true, message: "Successful Login", response: result};
    }
  }
  if(type === 'Employee') {
    const result = await Employee.findOne({emp_username: name});
    if(!result) {
      return {worked: false, message: "Username not found: Please Try Again", response: result};
    } else {
      if(result.emp_password !== pass) {
        return {worked: false, message: "Incorrect Password: Please Try Again", response: result};
      }
      return {worked: true, message: "Successful Login", response: result};
    }
  }
}


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
    const result = await authenticate(username, password, user_type)
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
  res.render("pages/signup");
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
    
    if (user_type === 'employee') {
      // If the user type is employee
      const empID = await getNextID(); // Generate ID for employee
      const newEmployee = new Employee({
        empID,
        empFN: first_name,
        empLN: last_name,
        empEmail: email,
        empPhone: phone,
        empStartDate: new Date(),
        activeFlag: true,
        modifiedDate: 0,
        emp_username: username,
        emp_password: password,
        //createTime: new Date(),
      });

      await newEmployee.save();
      res.redirect('/login')
    } else if (user_type === 'client') {
      // If the user type is client
      const clientID = await getNextID(); // Generate ID for client
      const newClient = new Client({
        clientID,
        clientFN: first_name,
        clientLN: last_name,
        clientEmail: email,
        clientPhone: phone,
        createTime: new Date(),
        activeFlag: true,
        modifiedDate: 0,
        client_username: username,
        client_password: password,
        
      });

      await newClient.save();
      res.redirect('/login');
    } else {
      // If the user type is neither client nor employee
      throw new Error("Invalid user type selected");
    }
  } catch (error) {
    // Handle any errors that occur during the signup process
    console.error("Error occurred during signup:", error);
    res.status(500).send("An error occurred during signup. Please try again later.");
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
  
})

// app.get("/add_pets", (req,res) => {
//   const user = req.session.user;
//   const user_type = req.session.type;
//   res.render("pages/add_pets", {user: user, type: user_type});
// })

// app.get("/emp_pets", (req,res) => {
//   res.render("pages/emp_pets");
// })

app.get("/emp_transactions", (req,res) => {
  res.render("pages/emp_transactions")
})

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

let currentPage = 1;
const pageSize = 10;

app.get("/emp_clients_search", async (req,res) => {
  try {
    const result = await getClients(currentPage, pageSize);
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

app.get("/emp_clients_edit", async (req, res) => {
  const clientId = req.query.clientId;
  try {
    const found_client = await getClientById(parseInt(clientId)); // Fetch the client data
    if (!found_client) {
      return res.status(404).send("Client not found");
    }
    res.render("pages/emp_clients_edit", { found_client: found_client }); // Pass the client data to the template
  } catch (error) {
    console.error("Error fetching client data:", error);
    res.status(500).send("Internal Server Error");
  }
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
      const pet_records = await Pet.find({ownerID: owner_id}).sort({petName:1}).skip(start-1).limit(end-start+1);
      return pet_records;
    } catch(error) {
        console.error("Error returning client information:", error);
        throw error;
    }
  }
  if(user_type=='Employee') {
    try {
      const pet_records = await Pet.find().sort({petName:1}).skip(start-1).limit(end-start+1);
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

const PORT = process.env.PORT;
module.exports = app;
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`));