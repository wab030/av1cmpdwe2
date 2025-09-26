-- Comando para criar o banco de dados (se ainda não existir)
DROP DATABASE cadastro;
CREATE DATABASE IF NOT EXISTS cadastro;
USE cadastro;

-- Comando para criar a tabela de livros
CREATE TABLE livros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255),
    ano_publicacao INT
);

-- 1. Insere o livro "1984"
INSERT INTO livros (titulo, autor, ano_publicacao) VALUES 
('1984', 'George Orwell', 1949);

-- 2. Insere o livro "O Pequeno Príncipe"
INSERT INTO livros (titulo, autor, ano_publicacao) VALUES 
('O Pequeno Príncipe', 'Antoine de Saint-Exupéry', 1943);

-- 3. Insere o livro "A Revolução dos Bichos"
INSERT INTO livros (titulo, autor, ano_publicacao) VALUES 
('A Revolução dos Bichos', 'George Orwell', 1945);

-- Opcional: Verifica se os dados foram inseridos corretamente
SELECT * FROM livros;