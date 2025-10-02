const app = require('./app'); // Importa a aplicação Express
const PORT = 5000; // Define a porta obrigatória

console.log('testando')

// Inicia o servidor na porta 5000
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});