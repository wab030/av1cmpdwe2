const mysql = require('mysql2/promise');
require('dotenv').config(); // Usar variáveis de ambiente é a melhor prática

// Configuração da conexão (Use as suas credenciais do MySQL)
const pool = mysql.createPool({
    host: 'localhost', 
    user: 'admin', 
    password: 'ifsp@1234', 
    database: 'cadastro',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
