const express = require('express');

const app = express();
const port = 3000;

const produtos = [
    {id: 1, nome: 'Lápis'}, {id: 2, nome:'caneta'}
]

app.set("view engine", "ejs");
app.use(express.static('./public'));

app.get('/produtos', (req, res) => {
    // res.render('home.ejs');
    res.send(produtos);
});

app.get('/tarsila', (req, res) => {
    res.render('tarsila.ejs');
});

app.listen(port, function() {
    console.log('Servidor rodando na porta: xxxxx', port);
});

module.exports = app;