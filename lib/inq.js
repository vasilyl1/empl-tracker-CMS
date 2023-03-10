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
                    "view budget of a Department",
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
                    active_request.department.dbquery(`
                    SELECT id AS Department_ID, name AS Department_Name 
                    FROM department`, true, active_request);
                    break;
                case "view all Roles":
                    active_request.role.dbquery(`
                    SELECT title AS Job_Title, role.id AS Role_ID, 
                    department.name AS Department_Name, salary as Salary 
                    FROM role 
                    JOIN department ON department_id = department.id`, true, active_request);
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
                    `, true, active_request);
                    break;
                case "view budget of a Department":
                    active_request.department.budget(active_request);
                    break;
                case "add a Department":
                    active_request.department.addDepartment(active_request);
                    break;
                case "add a Role":
                    active_request.role.addRole(active_request);
                    break;
                case "add an Employee":
                    active_request.employee.addEmployee(active_request);
                    break;
                case "update an Employee Role":
                    active_request.employee.updEmpRole(active_request);
                    break;
                default:
                    console.log('Thank you for using CMS');
                    active_request.department.db.end(); // stop the database
                    return;
            };
             
        });
}

module.exports = CMS_init;