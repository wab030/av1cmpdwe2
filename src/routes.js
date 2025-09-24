const express = require('express');
const router = express.Router();
const pool = require('./db');

// Listar livros disponíveis
router.get('/livros', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, titulo, autor, exemplares FROM livros'
    );
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ erro: 'Erro ao listar livros' });
  }
});

// Reservar um livro
router.post('/reservar', async (req, res) => {
  const { email, livroId } = req.body;
  if (!email || !livroId)
    return res.status(400).json({ erro: 'Email e livroId obrigatórios' });

  let conn; // Inicializa a variável 'conn' fora do try

  try {
    conn = await pool.getConnection(); // Obtém a conexão aqui

    await conn.beginTransaction();

    // ... toda a sua lógica de negócio ...

    await conn.commit();
    res.json({ mensagem: `Livro reservado com sucesso!` });

  } catch (err) {
    if (conn) {
      await conn.rollback();
    }
    console.error(err);
    res.status(500).json({ erro: 'Erro ao reservar livro' });

  } finally {
    if (conn) { // Verifica se a conexão foi realmente obtida antes de liberá-la
      conn.release();
    }
  }
});

// Livro mais reservado
router.get('/mais-reservado', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT titulo, autor, reservas FROM livros ORDER BY reservas DESC LIMIT 1'
    );
    if (rows.length === 0)
      return res.status(404).json({ erro: 'Nenhum livro encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao consultar livro mais reservado', err });
  }
}); 

module.exports = router;
