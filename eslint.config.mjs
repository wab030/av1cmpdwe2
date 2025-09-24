// eslint.config.mjs

import globals from "globals";
import js from "@eslint/js";

export default [
  // Define os arquivos e pastas que o ESLint deve ignorar.
  {
    ignores: ["tests/**"], // 👈 Exclui a pasta de testes
  },

  // Habilita as regras básicas de JavaScript
  js.configs.recommended,
  
  // Define o ambiente de execução como Node.js
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021
      }
    }
  }
];