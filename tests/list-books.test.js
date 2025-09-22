const axios = require('axios');

describe('API de Listagem de Livros', () => {
  it('deve retornar a lista de livros disponíveis com as informações corretas', async () => {
    // A URL da API vai depender de como o projeto do aluno é rodado
    const response = await axios.get('http://localhost:XXXX/books');
    expect(response.status).toBe(200);
    expect(response.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ titulo: 'Dom Casmurro', autor: 'Machado de Assis', exemplares: 3 }),
        expect.objectContaining({ titulo: 'A Hora da Estrela', autor: 'Clarice Lispector', exemplares: 2 }),
        expect.objectContaining({ titulo: 'O Pequeno Príncipe', autor: 'Antoine de Saint-Exupéry', exemplares: 5 }),
      ])
    );
  });
});