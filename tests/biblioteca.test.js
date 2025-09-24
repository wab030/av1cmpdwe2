const request = require("supertest");
const mysql = require("mysql2/promise");
const app = require("../src/app");

let connection;

beforeAll(async () => {
  connection = await mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "ifsp@1234",
    database: "biblioteca",
  });
});

beforeEach(async () => {
  // Limpa tabelas antes de cada teste
  await connection.query("DELETE FROM emprestimos");
  await connection.query("DELETE FROM usuarios");
  await connection.query("DELETE FROM livros");

  // Insere dados consistentes de teste
  await connection.query(
    "INSERT INTO usuarios (id, nome, email) VALUES (?, ?, ?)",
    [1, "João da Silva", "joao@email.com"]
  );

  await connection.query(
    "INSERT INTO livros (id, titulo, autor, exemplares, reservas) VALUES (?, ?, ?, ?, ?)",
    [1, "Dom Casmurro", "Machado de Assis", 3, 0]
  );

  await connection.query(
    "INSERT INTO livros (id, titulo, autor, exemplares, reservas) VALUES (?, ?, ?, ?, ?)",
    [2, "Memórias Póstumas", "Machado de Assis", 2, 0]
  );
});

afterAll(async () => {
  if (connection) await connection.end();
});

// ----------------- TESTES -----------------
describe("📚 Sistema de Biblioteca", () => {
  test("1. Deve listar todos os livros disponíveis com título, autor e exemplares", async () => {
    const res = await request(app).get("/livros");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const livro = res.body[0];
    expect(livro).toHaveProperty("titulo");
    expect(livro).toHaveProperty("autor");
    expect(livro).toHaveProperty("exemplares");
  });

  test("2. Usuário deve conseguir reservar um livro válido", async () => {
    const res = await request(app)
      .post("/reservar")
      .send({ email: "joao@email.com", livroId: 1 });

    expect(res.status).toBe(200);
    expect(res.body.mensagem).toMatch(/reservado/i);
  });

  test("3. Usuário não deve reservar outro livro sem devolver o primeiro", async () => {
    // Primeiro reserva
    await request(app)
      .post("/reservar")
      .send({ email: "joao@email.com", livroId: 1 });

    // Tenta reservar outro
    const res = await request(app)
      .post("/reservar")
      .send({ email: "joao@email.com", livroId: 2 });

    expect(res.status).toBe(400);
    expect(res.body.erro).toMatch(/já possui uma reserva/i);
  });
});
