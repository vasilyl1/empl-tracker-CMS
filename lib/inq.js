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
                    active_request.department.dbquery(`
                    SELECT id AS Department_ID, name AS Department_Name 
                    FROM department`);
                    active_request.department.initQuery(active_request);
                    break;
                case "view all Roles":
                    active_request.role.dbquery(`
                    SELECT title AS Job_Title, role.id AS Role_ID, 
                    department.name AS Department_Name, salary as Salary 
                    FROM role 
                    JOIN department ON department_id = department.id`);
                    active_request.role.initQuery(active_request);
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
                    `);
                    active_request.employee.initQuery(active_request);
                    break;
                case "add a Department":
                    inquirer
                        .prompt([{
                            type: "input",
                            message: "What is the name of the department?",
                            name: "department"
                        }])
                        .then((response) => {
                            active_request.department.dbquery(`
                        INSERT INTO department (name)
                        VALUES ("${response.department}")`);
                            console.log(`Added ${response.department} to the database.`);
                            active_request.department.initQuery(active_request);
                        });
                    break;
                case "add a Role":
                    active_request.department.db.query('SELECT department.name, department.id FROM department', (err, rows) => {
                        if (err) {
                            console.log(`\n ${err.message}`);
                        } else {
                            let questions = [];
                            for (let i = 0; i < rows.length; i++) { // provide list of department names for questioning
                                questions.push(rows[i].name);
                            }
                            inquirer
                                .prompt([
                                    {
                                        type: "input",
                                        message: "What is the name of the role?",
                                        name: "role"
                                    },
                                    {
                                        type: "input",
                                        message: "What is the salary for this role?",
                                        name: "salary",
                                        validate(value) {
                                            if (isNaN(value)) {
                                                return `The input should be a number.
                                                 Please try again!`
                                            } else return true;
                                        }
                                    },
                                    {
                                        type: "list",
                                        message: "Which department does the role belong to?",
                                        name: "department",
                                        choices: questions
                                    }
                                ])
                                .then((response) => {
                                    let x = -1;
                                    for (let i = 0; i < rows.length; i++) { // check for the ID of response array
                                        if (response.department === rows[i].name) {x = i};
                                    }
                                    active_request.role.dbquery(`
                                        INSERT INTO role (title, salary, department_id)
                                        VALUES ("${response.role}", ${response.salary}, ${rows[x].id})`);
                                    console.log(`Added ${response.role} to the database.`);
                                    active_request.role.initQuery(active_request);
                                });
                                
                                
                        }

                    });

                    break;
                case "add an Employee":
                    break;
                case "update an Employee Role":
                    break;
                default:
                    console.log('Thank you for using CMS');
                    active_request.department.db.end(); // stop the database
                    return;
            };
             
        });
}

module.exports = CMS_init;