const produtos = [
  { id: 1, nome: "Notebook Dell Inspiron", preco: 4500.00 },
  { id: 2, nome: "Smartphone Samsung Galaxy A52", preco: 2200.00 },
  { id: 3, nome: "Mouse sem fio Logitech", preco: 85.50 },
  { id: 4, nome: "Teclado mecânico HyperX", preco: 350.00 },
  { id: 5, nome: "Monitor LG Ultrawide 29''", preco: 1500.00 },
  { id: 6, nome: "Câmera Canon EOS Rebel T7i", preco: 3100.00 },
  { id: 7, nome: "Fone de ouvido Bluetooth Sony", preco: 420.00 },
  { id: 8, nome: "Impressora HP DeskJet", preco: 280.00 },
  { id: 9, nome: "Mochila para notebook Targus", preco: 120.00 },
  { id: 10, nome: "Webcam Logitech C920", preco: 290.00 }
];

export function getProdutos(req, res) {
  res.json(produtos);
}

export function criarProduto(req, res) {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ error: "Nome obrigatório" });
  
  const produto = { id: produtos.length + 1, nome };
  produtos.push(produto);
  res.status(201).json(produto);
}
