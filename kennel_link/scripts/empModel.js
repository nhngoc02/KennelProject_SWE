const Employee = require('../db_modules/employee')

async function getEmps(start, end, user_type, emp_id) {
    if(user_type=='Employee') {
      try {
        //const emps_records = await Employee.find({activeFlag: true}).sort({empLN: 1}).skip(start-1).limit(end);
        const emps_records = await Employee.find({
            activeFlag: true,
            empID: { $ne: emp_id }
          }).sort({ empLN: 1 }).skip(start - 1).limit(end);
        return emps_records;
      } catch(error) {
          console.error("Error returning employee information:", error);
          throw error;
      }
    }
};

module.exports = {
    getEmps
  }
