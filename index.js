const express = require('express');
const livroRoutes = require('./routes/livroRoutes');

// Usa a porta do ambiente ou 4088 por padrão (exemplo)
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

// Middleware para as rotas da API
app.use('/api', livroRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na portaaaaa ${PORT}`);
});