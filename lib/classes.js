const cTable = require('console.table'); // console.table package to print tables
const mysql = require('mysql2'); // import and require mysql2
const CMS_init = require('./inq'); // user interview functionality
const inquirer = require('inquirer'); // inquirer

class department {
    constructor(db, dep_id, dep_name) {
        this.db = db;
        this.dep_id = dep_id;
        this.dep_name = dep_name;
    }

    // Connect to database
    async init() {
        require('dotenv').config(); // define and read env configuration
        await (this.db = mysql.createConnection(
            {
                host: process.env.DBhost,
                // MySQL username,
                user: process.env.DBuser,
                // MySQL password here
                password: process.env.DBpassword,
                database: process.env.DBdatabase
            },
            console.log(`Connected to ${process.env.DBdatabase} database, user ${process.env.DBuser}`)
        ));
    }

    initQuery(active_request) { CMS_init(active_request); } // this initializes user interview

    dbquery(query, print, active_request) { // this method queries db by select argument and prints the results

        this.db.query(query, (err, rows) => {
            if (err) {
                console.log(err.message);
                return;
            }
            // print data table results here from rows
            if (print) {
                console.log(`\n`);
                console.table(rows);
                console.log(`\n`);
            }
            this.initQuery(active_request);
        });

    }

    addDepartment(active_request) {
        inquirer
            .prompt([{
                type: "input",
                message: "What is the name of the department to add?",
                name: "department"
            }])
            .then((response) => {
                this.db.query(`
            INSERT INTO department (name)
            VALUES ("${response.department}")`, (err, rows) => {
                    if (err) {
                        console.log(err.message);
                        return;
                    }
                    console.log(`Added ${response.department} to the database.\n`);
                    this.initQuery(active_request);
                });
            });
    }

    budget(active_request) { // views the budget of the department
        this.db.query('SELECT department.name, department.id FROM department', (err, rows) => {
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
                            type: "list",
                            message: "Which department you would like to see the budget for?",
                            name: "department",
                            choices: questions
                        }
                    ])
                    .then((response) => {
                        let x = -1;
                        for (let i = 0; i < rows.length; i++) { // check for the ID of response array
                            if (response.department === rows[i].name) { x = i };
                        }
                        //this.dbquery(`
                        //    INSERT INTO role (title, salary, department_id)
                        //    VALUES ("${response.role}", ${response.salary}, ${rows[x].id})`, false);
                        this.db.query(`
                        SELECT department.name AS Department_Name, 
                            SUM(role.salary) AS Budget 
                        FROM department 
                        JOIN role ON department_id = department.id 
                        JOIN employee ON role_id = role.id 
                        WHERE department.id = ${rows[x].id}
                        `, (err, rows) => {
                            if (err) {
                                console.log(err.message);
                                return;
                            }
                            // print data table results here from rows
                            console.log(`\n`);
                            console.table(rows);
                            console.log(`\n`);
                            this.initQuery(active_request);
                        });
                    });


            }

        });
    }
}

class role extends department {
    constructor(db, dep_id, dep_name, title, salary, role_id) {
        super(db, dep_id, dep_name);
        this.title = title;
        this.salary = salary;
        this.role_id = role_id;
    }

    dbquery(query, print, active_request) {
        return super.dbquery(query, print, active_request);
    }

    init() {
        return super.init();
    }

    initQuery(active_request) {
        return super.initQuery(active_request);
    }

    addRole(active_request) { // adds the new role into the database
        this.db.query('SELECT department.name, department.id FROM department', (err, rows) => {
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
                            if (response.department === rows[i].name) { x = i };
                        }
                        this.db.query(`
                        INSERT INTO role (title, salary, department_id)
                        VALUES ("${response.role}", ${response.salary}, ${rows[x].id})`, (err, rows) => {
                            if (err) {
                                console.log(err.message);
                                return;
                            }
                            console.log(`Added ${response.role} to the database. \n`);
                            this.initQuery(active_request);
                        });
                    });


            }

        });
    }
}

class employee extends role {
    constructor(db, dep_id, dep_name, title, salary, role_id,
        first_name, last_name, manager_id, empl_id) {
        super(db, dep_id, dep_name, title, salary, role_id);
        this.first_name = first_name;
        this.last_name = last_name;
        this.manager_id = manager_id;
        this.empl_id = empl_id;
    }

    dbquery(query, print, active_request) {
        return super.dbquery(query, print, active_request);
    }

    init() {
        return super.init();
    }

    initQuery(active_request) {
        return super.initQuery(active_request);
    }

    addEmployee(active_request) { // adds the new employee into the database
        this.db.query('SELECT role.title, role.id FROM role', (err1, rowsRole) => {
            this.db.query('SELECT first_name, last_name, id FROM employee', (err2, rowsMgr) => {

                if (err1) {
                    console.log(`\n ${err1.message}`);
                } else if (err2) {
                    console.log(`\n ${err2.message}`);
                } else {
                    let questionsRole = [];
                    let questionsMgr = [];
                    for (let i = 0; i < rowsRole.length; i++) { // provide list of department names for questioning
                        questionsRole.push(rowsRole[i].title);
                    }
                    for (let i = 0; i < rowsMgr.length; i++) { // provide list of department names for questioning
                        questionsMgr.push(`${rowsMgr[i].first_name} ${rowsMgr[i].last_name}`);
                    }
                    inquirer
                        .prompt([
                            {
                                type: "input",
                                message: "What is the employee first name?",
                                name: "empFirstName"
                            },
                            {
                                type: "input",
                                message: "What is the employee last name?",
                                name: "empLastName"
                            },
                            {
                                type: "list",
                                message: "What is the employee role?",
                                name: "empRole",
                                choices: questionsRole
                            },
                            {
                                type: "list",
                                message: "Who is the employee manager?",
                                name: "empMgr",
                                choices: questionsMgr
                            }
                        ])
                        .then((response) => {
                            let x = -1;
                            let y = -1;
                            for (let i = 0; i < rowsRole.length; i++) { // check for the ID of response array
                                if (response.empRole === rowsRole[i].title) { x = i };
                            };
                            for (let i = 0; i < rowsMgr.length; i++) { // check for the ID of response array
                                if (response.empMgr === `${rowsMgr[i].first_name} ${rowsMgr[i].last_name}`) { y = i };
                            }
                            this.db.query(`
                                INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                VALUES ("${response.empFirstName}", "${response.empLastName}", 
                                ${rowsRole[x].id}, ${rowsMgr[y].id})`, (err, rows) => {
                                if (err) {
                                    console.log(err.message);
                                    return;
                                }
                                console.log(`Added ${response.empFirstName} ${response.empLastName} to the database.\n`);
                                this.initQuery(active_request);
                            });
                        });
                }
            });
        });
    }
    updEmpRole(active_request) { // updates the role of existing employee
        this.db.query('SELECT role.title, role.id FROM role', (err1, rowsRole) => {
            this.db.query('SELECT first_name, last_name, id FROM employee', (err2, rowsMgr) => {

                if (err1) {
                    console.log(`\n ${err1.message}`);
                } else if (err2) {
                    console.log(`\n ${err2.message}`);
                } else {
                    let questionsRole = [];
                    let questionsMgr = [];
                    for (let i = 0; i < rowsRole.length; i++) { // provide list of department names for questioning
                        questionsRole.push(rowsRole[i].title);
                    }
                    for (let i = 0; i < rowsMgr.length; i++) { // provide list of department names for questioning
                        questionsMgr.push(`${rowsMgr[i].first_name} ${rowsMgr[i].last_name}`);
                    }
                    inquirer
                        .prompt([
                            {
                                type: "list",
                                message: "Which employee's role do you want to update?",
                                name: "empMgr",
                                choices: questionsMgr
                            },
                            {
                                type: "list",
                                message: "Which role do you want to assign to selected employee?",
                                name: "empRole",
                                choices: questionsRole
                            }
                        ])
                        .then((response) => {
                            let x = -1;
                            let y = -1;
                            for (let i = 0; i < rowsRole.length; i++) { // check for the ID of response array
                                if (response.empRole === rowsRole[i].title) { x = i };
                            };
                            for (let i = 0; i < rowsMgr.length; i++) { // check for the ID of response array
                                if (response.empMgr === `${rowsMgr[i].first_name} ${rowsMgr[i].last_name}`) { y = i };
                            }

                            this.db.query(`
                                UPDATE employee SET role_id = ${rowsRole[x].id} 
                                WHERE id = ${rowsMgr[y].id}`, (err, rows) => {
                                if (err) {
                                    console.log(err.message);
                                    return;
                                }
                                console.log(`Updated role for ${response.empMgr}.\n`);
                                this.initQuery(active_request);
                            });
                        });
                }
            });
        });
    };
}

module.exports = { department, role, employee };