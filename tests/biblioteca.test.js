const request = require("supertest");
const mysql = require("mysql2/promise");
const app = require("../src/app"); // importa só o app, sem .listen()

let connection;

beforeAll(async () => {
  connection = await mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "ifsp@1234",
    database: "biblioteca"
  });

  // Limpa tabelas
  await connection.query("DELETE FROM emprestimos");
  await connection.query("DELETE FROM usuarios WHERE email LIKE '%@example.com'");
  await connection.query("DELETE FROM livros");

  // Insere usuários de teste
  await connection.query(
    "INSERT INTO usuarios (id, nome, email) VALUES (?, ?, ?), (?, ?, ?)",
    [1, "João da Silva", "joao@email.com",
     2, "Maria Teste", "maria@example.com"]
  );

  // Insere livros de teste
  await connection.query(
    "INSERT INTO livros (id, titulo, autor, exemplares) VALUES (?, ?, ?, ?), (?, ?, ?, ?)",
    [1, "Dom Casmurro", "Machado de Assis", 3,
     2, "Memórias Póstumas", "Machado de Assis", 2]
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
    expect(res.body[0]).toHaveProperty("titulo");
    expect(res.body[0]).toHaveProperty("autor");
    expect(res.body[0]).toHaveProperty("exemplares");
  });

  test("2. Usuário deve conseguir reservar um livro válido", async () => {
    const res = await request(app)
      .post("/reservar")
      .send({ email: "joao@email.com", livroId: 1 });

    expect(res.status).toBe(200);
    expect(res.body.mensagem).toMatch(/reservado/i);
  });

  test("3. Usuário não deve reservar outro livro sem devolver o primeiro", async () => {
    const res = await request(app)
      .post("/reservar")
      .send({ email: "joao@email.com", livroId: 2 });

    expect(res.status).toBe(400);
    expect(res.body.erro).toMatch(/já possui uma reserva/i);
  });
});
