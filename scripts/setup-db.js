const mysql = require('mysql2/promise');
const { execSync } = require('child_process');

async function setupDatabase() {
  try {
    console.log('Iniciando container Docker do MySQL...');
    execSync('docker run --name mysql-test -e MYSQL_ROOT_PASSWORD=root -d -p 3306:3306 mysql:8.0', { stdio: 'inherit' });

    console.log('Aguardando o MySQL estar pronto...');
    // Aguarde alguns segundos para o container subir
    await new Promise(resolve => setTimeout(resolve, 10000));

    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: 'root',
    });

    console.log('Criando o banco de dados `biblioteca`...');
    await connection.query('CREATE DATABASE biblioteca');
    await connection.query('USE biblioteca');
    
    // ... Crie as tabelas e insira os dados conforme a prova
    const sql = `
      CREATE TABLE livros (
          id INT AUTO_INCREMENT PRIMARY KEY,
          titulo VARCHAR(255) NOT NULL,
          autor VARCHAR(255) NOT NULL,
          exemplares INT DEFAULT 1,
          reservas INT DEFAULT 0
      );
      CREATE TABLE usuarios (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE
      );
      INSERT INTO livros (titulo, autor, exemplares, reservas) VALUES
      ('Dom Casmurro', 'Machado de Assis', 3, 0),
      ('A Hora da Estrela', 'Clarice Lispector', 2, 0),
      ('O Pequeno Príncipe', 'Antoine de Saint-Exupéry', 5, 0);
      INSERT INTO usuarios (email) VALUES
      ('joao@example.com'),
      ('maria@example.com'),
      ('ana@example.com');
    `;

    await connection.query(sql);

    console.log('Banco de dados configurado com sucesso!');
    await connection.end();

  } catch (error) {
    console.error('Erro ao configurar o banco de dados:', error);
    process.exit(1);
  }
}

setupDatabase();