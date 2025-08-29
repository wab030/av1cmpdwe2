import request from "supertest";
import app from "../src/app.js";

describe("Testes automáticos - Produtos", () => {
  it("Deve criar um produto", async () => {
    const res = await request(app).post("/produtos").send({ nome: "Café" });
    expect(res.statusCode).toBe(201);
    expect(res.body.nome).toBe("Café");
  });

  it("Deve listar produtos", async () => {
    const res = await request(app).get("/produtos");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
