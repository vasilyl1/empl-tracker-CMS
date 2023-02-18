const express = require('express'); // import and require express.js
const mysql = require('mysql2'); // import and require mysql2
require('dotenv').config(); // define and read env configuration

const PORT = process.env.PORT || 3001; // server port configuration
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
  console.log(`Connected to the ${process.env.DBdatabaase} database.`)
);

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });
  
  app.listen(PORT, () => {
    console.log(`Server is listening to the port ${PORT}`);
  });