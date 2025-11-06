const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const db = pool.promise();

// Teste de conexão ao carregar
(async () => {
    try {
        await db.query('SELECT 1');
        console.log('Conexão com MySQL estabelecida com sucesso!');
    } catch (err) {
        console.error('Falha ao conectar ao MySQL:', err.message);
    }
})();

module.exports = db;