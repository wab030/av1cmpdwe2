const db = require('../database/db');

class LivroController {
  constructor() {
    this.db = db;
  }

  async listarLivrosDisponiveis(req, res) {
    try {
      // Query para buscar livros disponíveis (com exemplares > 0)
      const [rows] = await this.db.query('SELECT titulo, autor, exemplares FROM livros WHERE exemplares > 0');
      
      // Se não houver livros, envia uma resposta com status 404
      if (rows.length === 0) {
        return res.status(404).json({ message: "Nenhum livro disponível no momento." });
      }

      // Envia a lista de livros como resposta JSON
      res.status(200).json(rows);

    } catch (error) {
      console.error('Erro ao listar livros:', error);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
}

module.exports = new LivroController();