const express = require('express');
const router = express.Router();
const medicamentoController = require('../controllers/medicamentoController');

router.get('/', medicamentoController.getAll);
router.get('/estoque-baixo', medicamentoController.getLowStock);
router.post('/retirada', medicamentoController.withdraw);

module.exports = router;