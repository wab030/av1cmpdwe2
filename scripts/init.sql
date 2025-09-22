-- Criar banco de dados biblioteca se não existir
CREATE DATABASE IF NOT EXISTS biblioteca;
USE biblioteca;

-- Criar usuário admin com senha ifsp@1234
CREATE USER IF NOT EXISTS 'admin'@'%' IDENTIFIED BY 'ifsp@1234';
GRANT ALL PRIVILEGES ON biblioteca.* TO 'admin'@'%';
FLUSH PRIVILEGES;

-- Criar tabelas do sistema
CREATE TABLE IF NOT EXISTS livros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    ano_publicacao INT,
    disponivel BOOLEAN DEFAULT TRUE,
    exemplares INT DEFAULT 1  -- ⭐ COLUNA QUE FALTAVA!
);

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS emprestimos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    livro_id INT,
    usuario_id INT,
    data_emprestimo DATE,
    data_devolucao DATE,
    FOREIGN KEY (livro_id) REFERENCES livros(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Inserir dados de exemplo
INSERT IGNORE INTO livros (titulo, autor, ano_publicacao) VALUES
('Dom Casmurro', 'Machado de Assis', 1899),
('O Cortiço', 'Aluísio Azevedo', 1890),
('Iracema', 'José de Alencar', 1865);

INSERT IGNORE INTO usuarios (nome, email) VALUES
('João Silva', 'joao@email.com'),
('Maria Santos', 'maria@email.com'),
('João Teste', 'joao@example.com'),      -- ⭐ USUÁRIO DOS TESTES
('Maria Teste', 'maria@example.com');    -- ⭐ USUÁRIO DOS TESTES