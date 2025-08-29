import { avaliarCodigo } from "../src/avaliacaoIA.js";

const arquivo = "./src/controllers/produtosController.js";

avaliarCodigo(arquivo)
  .then(() => console.log("Avaliação concluída"))
  .catch(err => console.error(err));
