import express from "express";
import produtosRoutes from "./routes/produtos.js";

const app = express();
app.use(express.json());

// Rotas
app.use("/produtos", produtosRoutes);

export default app;
