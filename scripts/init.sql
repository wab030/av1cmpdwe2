-- Apaga o banco de dados se ele já existir para garantir uma instalação limpa
DROP DATABASE IF EXISTS biblioteca;

-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS biblioteca;
USE biblioteca;

-- Tabela de livros
CREATE TABLE IF NOT EXISTS livros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    exemplares INT DEFAULT 1,
    reservas INT DEFAULT 0
);

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE
);

-- Dados iniciais de livros
INSERT INTO livros (titulo, autor, exemplares, reservas) VALUES
('Dom Casmurro', 'Machado de Assis', 3, 0),
('A Hora da Estrela', 'Clarice Lispector', 2, 0),
('O Pequeno Príncipe', 'Antoine de Saint-Exupéry', 5, 0);

-- Dados iniciais de usuários
INSERT INTO usuarios (email) VALUES
('joao@example.com'),
('maria@example.com'),
('ana@example.com');