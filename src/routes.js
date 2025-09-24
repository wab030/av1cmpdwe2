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

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Verifica se usuário já tem reserva
    const [usuario] = await conn.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );
    if (usuario.length === 0)
      return res.status(400).json({ erro: 'Usuário não encontrado' });
    console.log(usuario);
    const [livro] = await conn.query('SELECT * FROM livros WHERE id = ?', [
      livroId,
    ]);
    if (livro.length === 0)
      return res.status(400).json({ erro: 'Livro não encontrado' });

    if (livro[0].exemplares <= 0) {
      await conn.rollback();
      return res.status(400).json({ erro: 'Livro sem exemplares disponíveis' });
    }

    // Verifica se usuário já reservou outro livro
    const usuarioId = usuario[0].id;

    const [reserva] = await conn.query(
      'SELECT * FROM livros WHERE id IN (SELECT livro_id FROM emprestimos WHERE usuario_id = ?) LIMIT 1',
      [usuarioId]
    );

    if (reserva.length > 0) {
      await conn.rollback();
      return res.status(400).json({ erro: 'Usuário já possui uma reserva' });
    }

    // Reduz exemplares e incrementa reservas
    await conn.query(
      'UPDATE livros SET exemplares = exemplares - 1, reservas = reservas + 1 WHERE id = ?',
      [livroId]
    );

    await conn.commit();
    res.json({ mensagem: `Livro '${livro[0].titulo}' reservado com sucesso!` });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ erro: 'Erro ao reservar livro' });
  } finally {
    conn.release();
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
    res.status(500).json({ erro: 'Erro ao consultar livro mais reservado' });
  }
});

module.exports = router;
