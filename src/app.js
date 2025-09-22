const express = require("express");
const app = express();
const routes = require("./routes");

app.use(express.json());
app.use(routes);

const PORT = 4040; // Ajuste conforme o enunciado (porta = 40 + dois últimos dígitos do CPF)
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app; // Exporta para os testes
