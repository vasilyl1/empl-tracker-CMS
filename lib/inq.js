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
                    break;
                case "view all Roles":
                    active_request.role.dbquery(`
                    SELECT title AS Job_Title, role.id AS Role_ID, 
                    department.name AS Department_Name, salary as Salary 
                    FROM role 
                    JOIN department ON department_id = department.id`);
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
                        });
                    break;
                case "add a Role":
                    active_request.department.db.query('SELECT department.name, department.id FROM department', (err, rows) => {
                        if (err) {
                            console.log(err.message);
                        } else {
                            let questions = [];
                            let ids = [];
                            for (let i = 0; i < rows.length; i++) {
                                questions.push(rows[i,1]);
                                ids.push(rows[i,2]);
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
                                        name: "salary"
                                    },
                                    {
                                        type: "input",
                                        message: "Which department does the role belong to?",
                                        name: "department",
                                        choices: questions
                                    }
                                ])
                                .then((response) => {
                                    let x = -1;
                                    for (i = 0; i < questions.length; i++) { // check what is the ID of the response array
                                        if (response.department === questions[i]) {x = i};
                                    }
                                    active_request.role.dbquery(`
                                        INSERT INTO role (title, salary)
                                        VALUES ("${response.role}", ${response.salary}, ${ids[x]})`);
                                    console.log(`Added ${response.role} to the database.`);
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
            CMS_init(active_request); // go back to the menu options 
        });
}

module.exports = CMS_init;