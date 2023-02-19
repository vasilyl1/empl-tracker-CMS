const inquirer = require('inquirer');

const CMS_init = function (active_request) {
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
                name: 'action',
                loop: false
            }
        ])
        .then((response) => {
            switch (response.action) {
                case "view all Departments":
                    active_request.department.dbquery(`SELECT id AS Department_ID, name AS Department_Name FROM department`); // query DB
                    break;
                case "view all Roles":
                    active_request.role.dbquery(`SELECT title AS Job_Title, role.id AS Role_ID, department.name AS Department_Name, salary as Salary FROM role JOIN department ON department_id = department.id`); // query DB
                    break;
                case "view all Employees":
                    break;
                case "add a Department":
                    break;
                case "add a Role":
                    break;
                case "add an Employee":
                    break;
                case "update an Employee Role":
                    break;
            }
            (response.action === "Quit")
                ? console.log('Thank you for using CMS')
                : CMS_init(active_request); // go back to the menu options
        });
}

module.exports = CMS_init;