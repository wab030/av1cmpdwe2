const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "admin",
  password: "ifsp@1234",
  database: "biblioteca",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
