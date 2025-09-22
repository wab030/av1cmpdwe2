import express from "express";
import { getProdutos, criarProduto } from "../controllers/produtosController.js";

const router = express.Router();

router.get("/", getProdutos);
router.post("/", criarProduto);

export default router;
