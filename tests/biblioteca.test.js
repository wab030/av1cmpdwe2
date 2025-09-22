const request = require("supertest");
const mysql = require("mysql2/promise");
const app = require("../src/app"); // seu Express app

let connection;

beforeAll(async () => {
  connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "biblioteca"
  });
});

afterAll(async () => {
  if (connection) await connection.end();
});

// ----------------- TESTES -----------------

describe("Sistema de Biblioteca - Prova", () => {
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
      .send({ email: "joao@example.com", livroId: 1 });

    expect(res.status).toBe(200);
    expect(res.body.mensagem).toMatch(/reservado/i);
  });

  test("3. Usuário não deve reservar outro livro sem devolver o primeiro", async () => {
    const res = await request(app)
      .post("/reservar")
      .send({ email: "joao@example.com", livroId: 2 });

    expect(res.status).toBe(400);
    expect(res.body.erro).toMatch(/já possui uma reserva/i);
  });

  test("4. Não deve permitir reserva quando não há exemplares", async () => {
    // força quantidade 0
    await connection.query("UPDATE livros SET exemplares = 0 WHERE id = 2");

    const res = await request(app)
      .post("/reservar")
      .send({ email: "maria@example.com", livroId: 2 });

    expect(res.status).toBe(400);
    expect(res.body.erro).toMatch(/sem exemplares/i);
  });

  test("5. Deve exibir o livro mais reservado", async () => {
    const res = await request(app).get("/mais-reservado");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("titulo");
    expect(res.body).toHaveProperty("reservas");
  });
});
