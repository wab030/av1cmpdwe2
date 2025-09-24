const request = require('supertest');
const mysql = require('mysql2/promise');
const app = require('../src/app');

let connection;
let livro1Id;
let livro2Id;

beforeAll(async () => {
  connection = await mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'ifsp@1234',
    database: 'biblioteca',
  });
});

beforeEach(async () => {
  // Limpa tabelas antes de cada teste
  await connection.query('DELETE FROM emprestimos');
  await connection.query(
    "DELETE FROM usuarios WHERE email LIKE '%@example.com' OR email = 'joao@email.com'"
  );
  await connection.query('DELETE FROM livros');

  // Insere usuários de teste
  await connection.query(
    'INSERT INTO usuarios (nome, email) VALUES (?, ?), (?, ?)',
    ['João da Silva', 'joao@email.com', 'Maria Teste', 'maria@example.com']
  );

  // Insere livros de teste
  await connection.query(
    'INSERT INTO livros (titulo, autor, exemplares) VALUES (?, ?, ?), (?, ?, ?)',
    [
      'Dom Casmurro',
      'Machado de Assis',
      3,
      'Memórias Póstumas',
      'Machado de Assis',
      2,
    ]
  );

  // Busca os IDs gerados
  const [livros] = await connection.query(
    'SELECT id, titulo FROM livros ORDER BY id ASC'
  );
  [livro1Id, livro2Id] = livros.map(l => l.id);
});

afterAll(async () => {
  if (connection) await connection.end();
  await pool.end(); // se estiver usando pool
});


// ----------------- TESTES -----------------
describe('📚 Sistema de Biblioteca', () => {
  test('1. Deve listar todos os livros disponíveis com título, autor e exemplares', async () => {
    const res = await request(app).get('/livros');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('titulo');
    expect(res.body[0]).toHaveProperty('autor');
    expect(res.body[0]).toHaveProperty('exemplares');
  });

  test('2. Usuário deve conseguir reservar um livro válido', async () => {
    const res = await request(app)
      .post('/reservar')
      .send({ email: 'joao@email.com', livroId: livro1Id });

    expect(res.status).toBe(200);
    expect(res.body.mensagem).toMatch(/reservado/i);
  });

  test('3. Usuário não deve reservar outro livro sem devolver o primeiro', async () => {
    // Primeiro reserva
    await request(app)
      .post('/reservar')
      .send({ email: 'joao@email.com', livroId: livro1Id });

    // Tenta reservar outro
    const res = await request(app)
      .post('/reservar')
      .send({ email: 'joao@email.com', livroId: livro2Id });

    expect(res.status).toBe(400);
    expect(res.body.erro).toMatch(/já possui uma reserva/i);
  });
});
