const mysql = require("mysql2/promise");

const pool = mysql.createPool({
   host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'ifsp@1234',
  database: process.env.DB_NAME || 'biblioteca',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
