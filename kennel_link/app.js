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

app.get("/login", (req,res) => {
  res.render("pages/login", {message: ""});
})

app.get("/dashboard", (req,res) => {
  const user = req.session.user
  const type = req.session.type
  res.render("pages/dashboard", {user: user, type: type})
})

app.get("/reservations", (req,res) => {
  const user = req.session.user
  const user_type = req.session.type
  res.render("pages/reservations", {user: user, type: user_type})
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
//Old code for 
/* 
app.post("/employeesignup", async (req, res) => {
  try {
      // Extract employee signup data from the request body
      const empID = await getNextID(); // Await the result of getNextID()
      empFN = req.body.first_name;
      empLN = req.body.last_name
      empEmail = req.body.email;
      empPhone = req.body.phone;
      emp_username = req.body.username;
      emp_password = req.body.password
      
     // Create a new instance of the Employee model with the signup data
      const newEmployee = new Employee({
          empID,
          empFN,
          empLN,
          empEmail,
          empPhone,
          empStartDate: null,
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
*/

//// NEW CODE
/*
app.post("/signup", async (req, res) => {
  try {
    // Extract employee signup data from the body
    const empID = await getNextID(); // Await the result of getNextID()
    const empFN = req.body.first_name;
    const empLN = req.body.last_name;
    const empEmail = req.body.email;
    const empPhone = req.body.phone;
    const emp_username = req.body.username;
    const emp_password = req.body.password;

    // Create a new instance of the Employee model with the signup data
    const newEmployee = new Employee({
      empID,
      empFN,
      empLN,
      empEmail,
      empPhone,
      empStartDate: null,
      activeFlag: true,
      modifiedDate: 0,
      emp_username,
      emp_password,
      createTime: new Date(),
    });

    // Save the new employee document to the database
    await newEmployee.save();

    // Respond with a success message
    res.status(201).send("Employee signup successful!");
  } catch (error) {
    // Handle any errors that occur during the employee signup process
    console.error("Error occurred during employee signup:", error);
    res.status(500).send("An error occurred during employee signup. Please try again later.");
  }

  try {
    // Extract client signup data from body of text
    const clientID = await getNextID(); // Await the result of getNextID()
    const clientFN = req.body.first_name;
    const clientLN = req.body.last_name;
    const clientEmail = req.body.email;
    const clientPhone = req.body.phone;
    const client_username = req.body.username;
    const client_password = req.body.password;

    // Create a new instance of the Client model with the signup data
    const newClient = new Client({
      clientID,
      clientFN,
      clientLN,
      clientEmail,
      clientPhone,
      activeFlag: true,
      modifiedDate: 0,
      client_username,
      client_password,
      createTime: new Date(),
    });

    // Save the new client document to the database
    await newClient.save();

    // Respond with a success message
    res.status(201).send("Client signup successful!");
  } catch (error) {
    // Handle any errors that occur during the client signup process
    console.error("Error occurred during client signup:", error);
    res.status(500).send("An error occurred during client signup. Please try again later.");
  }
});

*/

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
      console.log("Employee saved:", newEmployee);
      res.status(201).send("Employee signup successful!");
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
      console.log("Client saved:", newClient);
      res.status(201).send("Client signup successful!");
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

app.get("/emp_clients_edit", (req,res) => {
  res.render("pages/emp_clients_edit")
})

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
    console.log(clients.length);
    console.log(clients.type); // undefined
    console.log(clients);
    return clients;
  } catch(error) {
      console.error("Error returning client information:", error);
      throw error;
  }
}

app.get("/emp_clients_search", async (req,res) => {
  console.log("Entering search");
  try {
    const result = await getClients(1, 5);
    // res.render("pages/emp_clients_search", {clients: result})
    console.log(result);
    res.render("pages/emp_clients_search", {clients: result})
  } catch (error) {
    res.status(500).json({message: error.message});
    res.redirect('/emp_clients')
  }
})

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`));