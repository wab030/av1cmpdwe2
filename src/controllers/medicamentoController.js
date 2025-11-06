const Medicamento = require('../models/Medicamento');
const Joi = require('joi');

const retiradaSchema = Joi.object({
    medicamento_id: Joi.number().integer().min(1).required(),
    email_municipe: Joi.string().email().required()
});

exports.getAll = async (req, res) => {
    try {
        const medicamentos = await Medicamento.getAll();
        console.log(req.body);
        res.render('farmacia', {
            medicamentos,
            mensagem: req.query.mensagem || null,
            erro: req.query.erro || null,
            filtro: null
        });
    } catch {
        res.status(500).send('Erro no servidor');
    }
};

exports.getLowStock = async (req, res) => {
    try {
        const medicamentos = await Medicamento.getLowStock();
        console.log(req.body);
        res.render('farmacia', {
            medicamentos,
            mensagem: req.query.mensagem || null,
            erro: req.query.erro || null,
            filtro: 'ESTOQUE BAIXO'
        });
    } catch {
        res.status(500).send('Erro no servidor');
    }
};

exports.withdraw = async (req, res) => {
    try {
        console.log('Dados recebidos:', req.body);
        const { error } = retiradaSchema.validate(req.body);
        if (error) {
            const erroMsg = `Dados inválidos: ${error.details[0].message}`;
            return res.redirect(`/?erro=${encodeURIComponent(erroMsg)}`);
        }
        // Adicione mais lógica aqui e logs para verificar o fluxo
    } catch {
        res.status(500).send('Erro no servidor');
    }

    try {
        const med = await Medicamento.withdraw(req.body.medicamento_id, req.body.email_municipe);
        const sucessoMsg = `Retirada realizada com sucesso. Estoque atual: ${med.quantidade - 1}`;
        res.redirect(`/?mensagem=${encodeURIComponent(sucessoMsg)}`);
    } catch (err) {
        res.redirect(`/?erro=${encodeURIComponent(err.message)}`);
    }
};