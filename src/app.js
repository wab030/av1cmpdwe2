const express = require('express');
const app = express();
const livroRoutes = require('./routes/livroRoutes');
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); // Para parsear JSON
app.use(express.static('public')); 

// Rotas da Aplicação
app.use('/', livroRoutes);

module.exports = app;