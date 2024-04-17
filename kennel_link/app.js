const express = require('express')
const methodOverride = require("method-override");
const mongoose = require("./database");
const Client = require('./db_modules/client')
const Employee = require('./db_modules/employee')
const Pet = require('./db_modules/pet')
const session = require('express-session')
const reservation = require("./scripts/reservationModel")
const signup_login = require("./scripts/signupLoginModel")

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
      signup_login.addEmployee(first_name, last_name, email, phone, username, password);
      res.redirect('/login')
    } else if (user_type === 'client') {
      // If the user type is client
      signup_login.addClient(first_name, last_name, email, phone, username, password);
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
  
})

app.get("/add_pets", (req,res) => {
  const user = req.session.user;
  const user_type = req.session.type;
  res.render("pages/add_pets", {user: user, type: user_type});
})

app.get("/emp_pets", (req,res) => {
  res.render("pages/emp_pets");
})

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

async function getPets(start, end){
  try{
    const pets = await Pet.find().sort({petName: 1}).skip(start -1).limit(end - start+1);
    return pets;
  } catch(error){
    console.error("Error returning pet information:", error);
    throw error;
  }
}

getPets(1, 5)
  .then(pets => {
    console.log("Fetched pets");
  })
  .catch(error => {
    console.error("Error fetching pets:", error);
  });

  
app.get('/all_pets', async (req, res) => {
  try {
    // Fetch all pets from the database
    const pets = await Pet.find();

    // Send the pets as JSON response
    res.json(pets);
  } catch (error) {
    console.error('Error fetching all pets:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get("/emp_pets_search", async (req,res) => {
  try {
    const { searchQuery } = req.query; // Extract search query from request query parameters
    let pets = []; // Initialize pets array

    if (searchQuery) {
      // If there's a search query, fetch pets based on the query
      pets = await Pet.find({
        $or: [
          { petName: { $regex: searchQuery, $options: "i" } }, // Search by pet name (case-insensitive)
          { petBreed: { $regex: searchQuery, $options: "i" } }, // Search by pet breed (case-insensitive)
        ],
      }).sort({ petName: 1 }); // Sort pets by petName
    }
    // Render the page with the fetched pets
    res.render("pages/emp_pets_search", { pets, searchQuery });
  } catch (error) {
    console.error("Error fetching pets:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const PORT = process.env.PORT;
module.exports = app;
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`));