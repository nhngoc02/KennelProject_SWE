const Client = require("../db_modules/client")
const Employee = require("../db_modules/employee")

async function authenticateLogin(name, pass, type) {
    if(type === 'Client') {
      const result = await Client.findOne({client_username: name});
      if(!result) {
        //return {status: 500, message: "Username not found: Please Try Again"};
        return {worked: false, message: "Username not found: Please Try Again", response: result};
      } else {
        if(result.client_password !== pass) {
          //return {status: 500, message: "Incorrect Password: Please Try Again"};
          return {worked: false, message: "Incorrect Password: Please Try Again", response: result};
        }
        //return {status: 200, message: "Successful Login", response: result};
        return {worked: true, message: "Successful Login", response: result};
      }
    }
    if(type === 'Employee') {
      const result = await Employee.findOne({emp_username: name});
      if(!result) {
        //return {status: 500, message: "Username not found: Please Try Again"};
        return {worked: false, message: "Username not found: Please Try Again", response: result};
      } else {
        if(result.emp_password !== pass) {
          //return {status: 500, message: "Incorrect Password: Please Try Again"};
          return {worked: false, message: "Incorrect Password: Please Try Again", response: result};
        }
        return {worked: true, message: "Successful Login", response: result};
      }
    }
}

// When given the user type, email, phone, and username will return a boolean value on if the user is unique or a message 
async function uniqueUser(type, username, email, phone) {
  let unique = true;
  let message = "User is unique"
  console.log("Type is:", type)
  if(type === 'Client') {
    uniqueClientUsernameCheck = await Client.findOne({ client_username: username });
    uniqueClientEmailCheck = await Client.findOne({ clientEmail: email });
    uniqueClientPhoneCheck = await Employee.findOne({clientPhone: phone});
    if(uniqueClientUsernameCheck || uniqueClientPhoneCheck !== null) {
      unique = false;
      message = "Username already in Use"
    } else if(uniqueClientEmailCheck || uniqueClientEmailCheck !== null) {
      unique = false;
      message = "Email is already in use"
    } else if(uniqueClientPhoneCheck || uniqueClientPhoneCheck !== null) {
      unique = false
      message = "Phone is already in use"
    }
  } else if(type === 'Employee') {
    uniqueEmpUsernameCheck = await Employee.findOne({ emp_username: username });
    uniqueEmpEmailCheck = await Employee.findOne({ empEmail: email });
    uniqueEmpPhoneCheck = await Employee.findOne({empPhone: phone});
    if(uniqueEmpUsernameCheck || uniqueEmpPhoneCheck !== null) {
      unique = false;
      message = "Username already in Use"
    } else if(uniqueEmpEmailCheck || uniqueEmpEmailCheck !== null) {
      unique = false;
      message = "Email is already in use"
    } else if(uniqueEmpPhoneCheck || uniqueEmpPhoneCheck !== null) {
      unique = false
      message = "Phone is already in use"
    }
  } else {
    message = "Invalid User Type Selected"
  }
  return {unique: unique, message: message}
}

// When given the user type, email, phone, and username will return a boolean value on if the user is unique or a message 
async function uniqueUser(type, username, email, phone) {
  let unique = true;
  let message = "User is unique"
  console.log("Type is:", type)
  if(type === 'Client') {
    uniqueClientUsernameCheck = await Client.findOne({ client_username: username });
    uniqueClientEmailCheck = await Client.findOne({ clientEmail: email });
    uniqueClientPhoneCheck = await Employee.findOne({clientPhone: phone});
    if(uniqueClientUsernameCheck || uniqueClientPhoneCheck !== null) {
      unique = false;
      message = "Username already in Use"
    } else if(uniqueClientEmailCheck || uniqueClientEmailCheck !== null) {
      unique = false;
      message = "Email is already in use"
    } else if(uniqueClientPhoneCheck || uniqueClientPhoneCheck !== null) {
      unique = false
      message = "Phone is already in use"
    }
  } else if(type === 'Employee') {
    uniqueEmpUsernameCheck = await Employee.findOne({ emp_username: username });
    uniqueEmpEmailCheck = await Employee.findOne({ empEmail: email });
    uniqueEmpPhoneCheck = await Employee.findOne({empPhone: phone});
    if(uniqueEmpUsernameCheck || uniqueEmpPhoneCheck !== null) {
      unique = false;
      message = "Username already in Use"
    } else if(uniqueEmpEmailCheck || uniqueEmpEmailCheck !== null) {
      unique = false;
      message = "Email is already in use"
    } else if(uniqueEmpPhoneCheck || uniqueEmpPhoneCheck !== null) {
      unique = false
      message = "Phone is already in use"
    }
  } else {
    message = "Invalid User Type Selected"
  }
  return {unique: unique, message: message}
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
      modifiedDate: new Date(),
      emp_username: username,
      emp_password: pass,
    });

    await newEmployee.save();
        //res.status(200).send("Employee added successfully");
  } catch (error) {
    console.error("Error occurred during signup:", error);
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
      modifiedDate: new Date(),
      client_username: username,
      client_password: pass,    
    });
  
    await newClient.save();
  } catch (error) {
    console.error("Error occurred during signup:", error);
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
    authenticateLogin,
    uniqueUser
}