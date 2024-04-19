const Client = require("../db_modules/client")
const Employee = require("../db_modules/employee")

async function authenticateLogin(name, pass, type) {
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

async function addEmployee(first, last, email, phone, username, pass) {
    try {
        const empID = await getNextID(); // Generate ID for employee
        const newEmployee = new Employee({
            empID,
            empFN: first,
            empLN: last,
            empEmail: email,
            empPhone: phone,
            empStartDate: new Date(),
            activeFlag: true,
            modifiedDate: 0,
            emp_username: username,
            emp_password: pass,
        });

        await newEmployee.save();
    } catch (error) {
        console.error("Error occurred during signup:", error);
        res.status(500).send("An error occurred during signup. Please try again later.");
    }
}

async function addClient(first, last, email, phone, username, pass) {
    try {
        const clientID = await getNextID(); // Generate ID for client
        const newClient = new Client({
          clientID,
          clientFN: first,
          clientLN: last,
          clientEmail: email,
          clientPhone: phone,
          createTime: new Date(),
          activeFlag: true,
          modifiedDate: 0,
          client_username: username,
          client_password: pass,
          
        });
  
        await newClient.save();
    } catch (error) {
        console.error("Error occurred during signup:", error);
        res.status(500).send("An error occurred during signup. Please try again later.");
    }
}

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

module.exports = {
    addClient,
    addEmployee,
    authenticateLogin
}