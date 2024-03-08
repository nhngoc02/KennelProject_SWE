const express = require('express')
const methodOverride = require("method-override");
const mongoose = require("./database");
const Client = require('./db_modules/client')
const Employee = require('./db_modules/employee')

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

async function authenticate(name, pass, user_type) {
  if(user_type = 'client') {
    const result = await Client.find({client_username: name, client_password: pass}).exec();
    if(result.length == 0) {
      console.log("Client not found")
      return false;
    } else {
      return true;
    }
  } else if(user_type = 'employee') {
    const result = await Employee.find({emp_username: name, emp_password: pass}).exec();
    if(result.length == 0) {
      return false;
    } else {
      return true;
    }
  }
}

app.get('/', (req, res) => {
  console.log("Displaying homepage")
  res.render('pages/homepage')
})

app.get("/signup", (req, res) => {
  res.render("pages/signup");
})

app.get("/login", (req,res) => {
  res.render("pages/login");
})

app.post("/login", async (req,res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const user_type = req.body.user_type;
    if(authenticate(username, password, user_type) && user_type === 'client') {
      const person = await Client.findOne({client_username: username, client_password: password}, 'clientFN clientLN')
      res.render("pages/client_dash", {first:person.clientFN, last:person.clientLN} )
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

/*
const { empID, empFN, empLN, empEmail, empPhone, empStartDate, emp_username, emp_password } = req.body;

// Connect to the MongoDB server
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
        res.status(500).send("An error occurred during employee signup. Please try again later.");
        return;
    }

    try {
        // Access the database and the employee collection
        const db = client.db('your_database_name'); // Replace 'your_database_name' with your actual database name
        const employeeCollection = db.collection('employee'); // Replace 'employee' with your actual collection name

        // Insert a new document into the employee collection
        employeeCollection.insertOne({
            empID,
            empFN,
            empLN,
            empEmail,
            empPhone,
            empStartDate,
            emp_username,
            emp_password,
            activeFlag: true,
            createTime: new Date()
        }, (err, result) => {
            if (err) {
                console.error('Error inserting employee:', err);
                res.status(500).send("An error occurred during employee signup. Please try again later.");
                return;
            }
            console.log('New employee inserted with _id:', result.insertedId);
            res.status(201).send("Employee signup successful!");
        });
    } finally {
        // Close the connection
        client.close();
    }
});
*/
//still needs further implementation
/*
app.post("/clientsignup", async (req, res) => {
  try {
      // Extract client signup data from the request body  ***Need to adjust to remove start date from dynamic html
      clientID = 40;
      clientFN = req.body.first_name;
      clientLN = req.body.last_name
      clientEmail = req.body.email;
      clientPhone = req.body.phone;
      client_username = req.body.username;
      client_password = req.body.password
      
     // Create a new instance of the Employee model with the signup data
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
          createTime: new Date()
      });

      // Save the new employee document to the database
      await newClient.save();

      // Respond with a success message
      res.status(201).send("Client signup successful!");
  } catch (error) {
      // Handle any errors that occur during the signup process
      console.error("Error occurred during client signup:", error);
      res.status(500).send("An error occurred during employee signup. Please try again later.");
  }
});
*/

// Function to calculate the next available empID
/*
async function getNextID() {
    try {
      const maxEmployee = await db.employee.find().sort({ empID: -1 }).limit(1).toArray();
      const maxClient = await db.client.find().sort({ clientID: -1 }).limit(1).toArray();
        // Determine the maximum ID from both collections
        const maxID = Math.max(maxClient.clientID || 0, maxEmployee.empID || 0) + 1;

        return maxID;
    } catch (error) {
        console.error("Error calculating next empID:", error);
        throw error;
    }
}
*/
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








app.get("/home", (req,res) => {
  res.render("pages/client_dash")
})


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`));