const express = require('express');
const router = express.Router();
const LivroController = require('../controllers/LivroController');

// Rota principal (GET /) - Leitura e Formulário
router.get('/', LivroController.exibirPagina);

// Rota para a gravação (POST /livros)
router.post('/livros', LivroController.adicionarLivro);

module.exports = router;