const mysql = require("mysql");
require("dotenv").config();

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

conn.connect(err => {
  if (err) {
    console.log(`Database Connection ${err}`);
  } else {
    console.log("Database Successfully Connected \n  Press ctrl + C to stop!");
  }
});

module.exports = conn;
