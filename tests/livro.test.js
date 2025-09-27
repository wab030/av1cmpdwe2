const request = require('supertest');
// IMPORTANTE: Altera a importação para o novo arquivo 'app.js'
const app = require('../src/app');
const pool = require('../src/db');

// Define um livro válido para testes
const livroValido = {
    titulo: 'O Teste da Vida',
    autor: 'A. Testador',
    ano_publicacao: 2024
};

// --- LIMPEZA DO BANCO DE DADOS ---
// Esta função garante que o banco esteja limpo antes e depois dos testes que gravam dados
const limparBanco = async () => {
    try {
        await pool.query('TRUNCATE TABLE livros');
    } catch (error) {
        console.error("Erro ao limpar o banco de dados:", error);
        // O teste deve falhar se não puder limpar o banco, pois a isolação é crítica.
        throw error;
    }
};

describe('Testes de Integração da Aplicação', () => {

    // Garante que o banco esteja limpo antes de rodar qualquer teste
    beforeAll(async () => {
        await limparBanco();
    });

    // Limpa o banco após a conclusão de todos os testes
    afterAll(async () => {
        await limparBanco();
        await pool.end(); // Fecha a conexão do pool
    });

    // --- TESTE DE LEITURA (GET /) ---
    describe('GET /', () => {
        it('Deve retornar status 200 e renderizar a página inicial (View)', async () => {
            const response = await request(app)
                .get('/');

            expect(response.statusCode).toBe(200);
            // Verifica se o rodapé obrigatório está presente na view renderizada
            expect(response.text).toContain('Desenvolvido por:');
        });
    });

    // --- TESTES DE GRAVAÇÃO (POST /livros) ---
    describe('POST /livros (Gravação e Validação)', () => {

        it('T1: Deve cadastrar um livro válido e redirecionar (Status 302)', async () => {
            const response = await request(app)
                .post('/livros')
                .send(livroValido);

            // Um POST bem-sucedido em um formulário deve redirecionar (302)
            expect(response.statusCode).toBe(302);
            expect(response.header.location).toBe('/');

            // Verifica se o dado foi realmente inserido (opcional, mas bom)
            const [rows] = await pool.query('SELECT titulo FROM livros WHERE titulo = ?', [livroValido.titulo]);
            expect(rows.length).toBe(1);
        });

        // --- TESTE DE ERRO JOI (400) - CAMPO OBRIGATÓRIO FALTANDO ---
        it('T2: Deve rejeitar o cadastro se o TÍTULO estiver faltando (Status 400)', async () => {
            const livroInvalido = { autor: 'X', ano_publicacao: 2020 }; // Título faltando

            const response = await request(app)
                .post('/livros')
                .send(livroInvalido);

            // Espera status 400 Bad Request
            expect(response.statusCode).toBe(400);

            // CORREÇÃO AQUI: A mensagem completa que aparece no HTML
            expect(response.text).toContain('Erro de Validação: Título é obrigatório.');
        });

        // --- TESTE DE ERRO JOI (400) - ANO FUTURO ---
        it('T3: Deve rejeitar o cadastro se o ANO DE PUBLICAÇÃO for futuro (Status 400)', async () => {
            const anoFuturo = new Date().getFullYear() + 1;
            const livroFuturo = { ...livroValido, ano_publicacao: anoFuturo };

            const response = await request(app)
                .post('/livros')
                .send(livroFuturo);

            // Espera status 400 Bad Request
            expect(response.statusCode).toBe(400);
            // Espera a mensagem de erro específica do JOI
            expect(response.text).toContain('Ano de Publicação não pode ser futuro.');
        });

    });
});