const express = require('express');
const app = express();

app.use(express.json());
app.use(require('./routes')); // suas rotas

module.exports = app; // exporta só o app
