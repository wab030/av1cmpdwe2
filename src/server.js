const app = require('./app');  // Importa a aplicação Express
const PORT = 4000;  // Porta obrigatória conforme PDF

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});