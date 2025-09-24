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

    // Buscar usuário
    const [usuarios] = await conn.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (usuarios.length === 0) return res.status(400).json({ erro: 'Usuário não encontrado' });
    const usuario = usuarios[0];

    // Buscar livro
    const [livros] = await conn.query('SELECT * FROM livros WHERE id = ?', [livroId]);
    if (livros.length === 0) return res.status(400).json({ erro: 'Livro não encontrado' });
    const livro = livros[0];

    if (livro.exemplares <= 0) {
      await conn.rollback();
      return res.status(400).json({ erro: 'Livro sem exemplares disponíveis' });
    }

    // Verificar reserva existente
    const [reservas] = await conn.query(
      'SELECT * FROM emprestimos WHERE usuario_id = ? AND data_devolucao IS NULL LIMIT 1',
      [usuario.id]
    );
    if (reservas.length > 0) {
      await conn.rollback();
      return res.status(400).json({ erro: 'Usuário já possui uma reserva' });
    }

    // Criar empréstimo e atualizar exemplares
    await conn.query(
      'INSERT INTO emprestimos (usuario_id, livro_id, data_emprestimo) VALUES (?, ?, NOW())',
      [usuario.id, livro.id]
    );
    await conn.query('UPDATE livros SET exemplares = exemplares - 1 WHERE id = ?', [livro.id]);

    await conn.commit();
    res.json({ mensagem: `Livro '${livro.titulo}' reservado com sucesso!` });
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
