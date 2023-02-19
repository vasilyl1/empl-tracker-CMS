const inquirer = require('inquirer'); 
const dbquery = require('./dbquery'); // DB queries function

const CMS_init = function (db) {
    inquirer
    .prompt([
      {
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            "view all Departments", 
            "view all Roles",
            "view all Employees", 
            new inquirer.Separator(),
            "add a Department",
            "add a Role",
            "add an Employee",
            "update an Employee Role",
            "Quit"
        ],
        name: 'action1',
        loop : false
      }
    ])
    .then((response) => {
        dbquery(db,response.action1); // query DB
        (response.action1 === "Quit") 
        ? console.log('Thank you for using CMS') 
        : CMS_init(db); // go back to the menu options
    }); 
}

module.exports = CMS_init;