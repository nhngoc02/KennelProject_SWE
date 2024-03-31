const express = require('express')
const methodOverride = require("method-override");
const mongoose = require("./database");
const Client = require('./db_modules/client')
const Employee = require('./db_modules/employee')
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

async function getInfo(username, type) {
  
}

app.get('/', (req, res) => {
  res.render('pages/homepage')
})

app.get("/signup", (req, res) => {
  res.render("pages/signup");
})

app.get("/emp-dash", (req,res) => {
  res.render("pages/emp_dash")
})

app.get("/login", (req,res) => {
  res.render("pages/login", {message: ""});
})

app.get("/reservations", (req,res) => {
  const user_kind = req.session.user
  const user_type = req.session.type
  res.render("pages/reservations", {user: user_kind, type: user_type})
})

app.get("/client-dash", (req,res) => {
  const client = req.session.user
  res.render("pages/client_dash", {first: client.clientFN, last: client.clientLN})
})

app.post("/login", async (req,res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const user_type = req.body.user_type;
    const result = await authenticate(username, password, user_type)
    if(result.worked === true) {
      if(user_type === 'Client') {
        req.session.user = result.response
        req.session.type = user_type
        res.render("pages/client_dash", {first: result.response.clientFN, last: result.response.clientLN});
      } else if(user_type === 'Employee') {
        req.session.user = result.response
        req.session.type = user_type
        res.render("pages/emp_dash", {first: result.response.empFN, last: result.response.empLN})
      }
    } else {
      res.render("pages/login", {message: result.message})
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

app.post("/employeesignup", async (req, res) => {
  try {
      // Extract employee signup data from the request body
      const empID = await getNextID(); // Await the result of getNextID()
      empFN = req.body.first_name;
      empLN = req.body.last_name
      empEmail = req.body.email;
      empPhone = req.body.phone;
      empStartDate = req.body.employee_start_date;
      emp_username = req.body.username;
      emp_password = req.body.password
      
     // Create a new instance of the Employee model with the signup data
      const newEmployee = new Employee({
          empID,
          empFN,
          empLN,
          empEmail,
          empPhone,
          empStartDate,
          activeFlag: true,
          modifiedDate: 0,
          emp_username,
          emp_password,
          createTime: new Date()
      });

      // Save the new employee document to the database
      await newEmployee.save();

      // Respond with a success message
      res.status(201).send("Employee signup successful!");
  } catch (error) {
      // Handle any errors that occur during the signup process
      console.error("Error occurred during employee signup:", error);
      res.status(500).send("An error occurred during employee signup. Please try again later.");
  }
});

app.get("/emp_clients", (req,res) => {
  res.render("pages/emp_clients")
})

app.get("/emp_pets", (req,res) => {
  res.render("pages/emp_pets")
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

app.get("/emp_pets_search", (req,res) => {
  res.render("pages/emp_pets_search")
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

app.get("/emp_clients_search", async (req,res) => {
  try {
    const result = await getClients(1, 5);
    // res.render("pages/emp_clients_search", {clients: result})
    // console.log(result);
    res.render("pages/emp_clients_search", {clients: result})
  } catch (error) {
    res.status(500).json({message: error.message});
    res.redirect('/emp_clients')
  }
})

async function getClientById(client_id) {
  try {
    //const client_record = await Client.findOne({clientID: client_id});
    const client_record = await Client.find({clientID: client_id});
    console.log(client_record);
    return client_record;
  } catch(error) {
      console.error("Error returning client information:", error);
      throw error;
  }
}

app.get("/emp_clients_edit", async (req, res) => {
  console.log("Entering client edit");
  // const clientId = req.query.clientId;
  const clientId = req.body.data_clientid;
  console.log(clientId)
  try {
    // Fetch the client data based on the client ID
    const result = await getClientById(clientId); // Assuming getClientById is a function to fetch client by ID
    console.log(result)

    if (!result) {
      // If client is not found, render an error page or redirect to the clients list page
      return res.status(404).send("Client not found");
    }

    // Render the edit page with the client data
    res.render("pages/emp_clients_edit", { client: result});
  } catch (error) {
    // Handle any errors
    console.error("Error fetching client data:", error);
    res.status(500).send("Internal Server Error");
  }
});

// app.get("/emp_clients_edit/:id", async (req, res) => {
//   console.log("Entering client edit");
//   const clientId = req.params.id;
//   console.log(clientId)
//   try {
//     // Fetch the client data based on the client ID
//     const result = await getClientById(clientId); // Assuming getClientById is a function to fetch client by ID
//     console.log(result)

//     if (!result) {
//       // If client is not found, render an error page or redirect to the clients list page
//       return res.status(404).send("Client not found");
//     }

//     // Render the edit page with the client data
//     res.render("pages/emp_clients_edit", { client: result});
//   } catch (error) {
//     // Handle any errors
//     console.error("Error fetching client data:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`));