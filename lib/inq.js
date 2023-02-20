const inquirer = require('inquirer'); // inquirer

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
                    active_request.employee.dbquery(`
                    SELECT e1.id AS Empl_ID, 
                    e1.first_name AS Employee_First_Name, 
                    e1.last_name AS Employee_Last_Name, 
                    role.title AS Job_Title, 
                    department.name AS Dept_Name, 
                    salary AS Salary, 
                    e1.manager_id AS MGR_ID,
                    employee.first_name AS Mgr_First_Name,
                    employee.last_name AS Mgr_Last_Name
                    FROM employee AS e1
                    JOIN role ON role_id = role.id
                    JOIN department ON department_id = department.id
                    LEFT JOIN employee ON e1.manager_ID = employee.id
                    `); // query DB
                    break;
                case "add a Department":
                    break;
                case "add a Role":
                    break;
                case "add an Employee":
                    break;
                case "update an Employee Role":
                    break;
                default:
                    console.log('Thank you for using CMS');
                    return;
            }
            CMS_init(active_request); // go back to the menu options    
        });
}

module.exports = CMS_init;