const express = require('express');
const app = express();
const livroRoutes = require('./routes/livroRoutes');

// Configuração do EJS como motor de visualização
app.set('view engine', 'ejs');
app.set('views', 'src/views');

// Middlewares
app.use(express.urlencoded({ extended: true })); // Para parsear dados de formulário
app.use(express.json()); // Para parsear JSON
app.use(express.static('public')); // Servir arquivos estáticos

// Rotas da Aplicação
app.use('/', livroRoutes);
console.log('ewt');

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
    console.error(err.stack);
    // Para erros não tratados ou de DB
    res.status(500).render('error', { 
        message: "Erro interno do se        rvidor. Tente novamente mais tarde." 
    });
});

// Exporta a instância do aplicativo para ser usada pelo server.js e pelos testes!
module.exports = app;