const LivroModel = require('../models/LivroModel');
const livroSchema = require('../utils/livroValidation'); // Importa o schema Joi

class LivroController {
    // Função auxiliar para carregar a View com a lista de livros
    static async renderWithLivros(res, errorMessage = null) {
        try {
            const livros = await LivroModel.listarTodos();
            res.render('index', { 
                livros: livros,
                error: errorMessage 
            });
        } catch (error) {
            // Se falhar ao listar, retorna um 500
            res.status(500).send('Erro fatal ao carregar a página.');
        }
    }

    // 1. Lida com a requisição GET / (Leitura e exibição do formulário)
    static async exibirPagina(req, res, next) {
        await LivroController.renderWithLivros(res);
    }

    // 2. Lida com a requisição POST /livros (Gravação)
    static async adicionarLivro(req, res, next) {
        const data = req.body;
        
        // --- INÍCIO: VALIDAÇÃO COM JOI ---
        const { error, value } = livroSchema.validate(data, { abortEarly: false });

        if (error) {
            // Se a validação falhar, extrai a primeira mensagem de erro
            const errorMessage = error.details[0].message;
            // Retorna 400 Bad Request e renderiza a página com a mensagem de erro
            return res.status(400).render('index', { 
                livros: await LivroModel.listarTodos(), // Recarrega a lista para não perder o estado
                error: `Erro de Validação: ${errorMessage}` 
            });
        }
        // --- FIM: VALIDAÇÃO COM JOI ---

        // Se a validação passou, continua com a gravação
        try {
            // Passa os dados validados (value) para o Model
            await LivroModel.adicionar(value.titulo, value.autor, value.ano_publicacao); 
            res.redirect('/'); 
        } catch (dbError) {
            // Erro do banco de dados (500 Internal Server Error)
            next(dbError); 
        }
    }
}

module.exports = LivroController;