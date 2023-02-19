const mysql = require('mysql2'); // import and require mysql2
require('dotenv').config(); // define and read env configuration
const {department,role,employee} = require('./lib/classes'); // defines the current record as objects
const CMS_init = require ('./lib/inq'); // user interview functionality
const active_record = { // active selected record
    department : new department,
    role : new role,
    employee : new employee
};

// Connect to database
const db = mysql.createConnection(
  {
    host: process.env.DBhost,
    // MySQL username,
    user: process.env.DBuser,
    // MySQL password here
    password: process.env.DBpassword,
    database: process.env.DBdatabase
  },
  console.log(`Connected to ${process.env.DBdatabase} database, user ${process.env.DBuser}`)
);

// start CMS system
CMS_init(db);