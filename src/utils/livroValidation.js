const Joi = require('joi');

// Define o esquema de validação para um novo livro
const livroSchema = Joi.object({
    titulo: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.base': `Título deve ser texto.`,
            'string.empty': `Título é um campo obrigatório.`,
            'string.min': `Título deve ter no mínimo {#limit} caracteres.`,
            'any.required': `Título é obrigatório.`
        }),
    
    autor: Joi.string()
        .max(255)
        .required()
        .messages({
            'string.empty': `Autor é um campo obrigatório.`,
            'any.required': `Autor é obrigatório.`
        }),

    ano_publicacao: Joi.number()
        .integer()
        .min(1000)
        .max(new Date().getFullYear())
        .required()
        .messages({
            'number.base': `Ano de Publicação deve ser um número.`,
            'number.min': `Ano de Publicação inválido.`,
            'number.max': `Ano de Publicação não pode ser futuro.`,
            'any.required': `Ano de Publicação é obrigatório.`
        })
});

module.exports = livroSchema;