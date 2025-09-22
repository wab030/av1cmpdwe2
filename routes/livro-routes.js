const express = require('express');
const router = express.Router();
const livroController = require('../controllers/LivroController');

// Define a rota GET /books para listar os livros disponíveis
router.get('/books', livroController.listarLivrosDisponiveis);

module.exports = router;