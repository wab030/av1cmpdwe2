const app = require('./app');

const PORT = 4040;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
