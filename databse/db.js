const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '127.0.0.1', // O host do container Docker
  user: 'root',
  password: 'root',
  database: 'biblioteca'
});

module.exports = pool;