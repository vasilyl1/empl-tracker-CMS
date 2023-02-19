const mysql = require('mysql2'); // import and require mysql2
const cTable = require('console.table'); // console.table package to print tables

const dbquery = function (db, query) {
    let sql =''; // database query
    switch (query) {
        case "view all Departments":
            sql = `SELECT id AS Department_ID, name AS Department_Name FROM department`;
            break;
        case "view all Roles":
            break;

    }
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err.message);
            return;
        }
        // print data table results here from rows
        console.log(rows);
    });

}
module.exports = dbquery;