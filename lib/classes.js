const cTable = require('console.table'); // console.table package to print tables
const mysql = require('mysql2'); // import and require mysql2

class department {
    constructor(db, dep_id, dep_name) {
        this.db = db;
        this.dep_id = dep_id;
        this.dep_name = dep_name;
    }

    // Connect to database
    async init() {
        require('dotenv').config(); // define and read env configuration
        await(this.db = mysql.createConnection(
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

    dbquery(query) { // query is the SQL request

        this.db.query(query, (err, rows) => {
            if (err) {
                console.log(err.message);
                return;
            }
            // print data table results here from rows
            console.log(`\n\n`);
            console.table(rows);
            console.log(`\n\n\n\n\n\n\n\n Press any key to return to the prompt`);

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

    dbquery(query) {
        return super.dbquery(query);
    }

    init() {
        return super.init();
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

    dbquery(query) {
        return super.dbquery(query);
    }

    init() {
        return super.init();
    }
}

module.exports = { department, role, employee };