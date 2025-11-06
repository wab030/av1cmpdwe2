const express = require('express');
const path = require('path');
const medicamentoRoutes = require('./routes/medicamentoRoutes');

const app = express();

// Configurações
app.use(express.urlencoded({ extended: true }));  // Para POST forms
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rotas
app.use(medicamentoRoutes);

module.exports = app;