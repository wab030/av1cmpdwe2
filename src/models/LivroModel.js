const pool = require('../db');

class LivroModel {

    // Função de Leitura (GET)
    static async listarTodos() {
        try {
            const [rows] = await pool.query('SELECT * FROM livros ORDER BY id DESC');
            return rows;
        } catch (error) {
            console.error("Erro ao listar livros no Model:", error);
            throw new Error("Falha na leitura dos dados do banco.");
        }
    }

    // Função de Gravação (POST)
    static async adicionar(titulo, autor, ano_publicacao) {
        try {
            const query = 'INSERT INTO livros (titulo, autor, ano_publicacao) VALUES (?, ?, ?)';
            // O ano_publicacao deve ser convertido para INT
            const [result] = await pool.query(query, [titulo, autor, parseInt(ano_publicacao)]);
            return result.insertId;
        } catch (error) {
            console.error("Erro ao adicionar livro no Model:", error);
            // Lança um erro para que o Controller possa tratá-lo e retornar um 500 ou 400
            throw new Error("Falha na gravação dos dados no banco."); 
        }
    }
}

module.exports = LivroModel;