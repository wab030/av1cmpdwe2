const db = require('../config/db');

class Medicamento {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM medicamentos');
        return rows;
    }

    static async getLowStock() {
        const [rows] = await db.query('SELECT * FROM medicamentos WHERE quantidade < 3');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM medicamentos WHERE id = ?', [id]);
        return rows[0];
    }

    static async checkIfWithdrawn(email, medicamento_id) {
        const [rows] = await db.query(
            'SELECT * FROM retiradas WHERE email_municipe = ? AND medicamento_id = ?',
            [email, medicamento_id]
        );
        return rows.length > 0;
    }

    static async withdraw(medicamento_id, email) {
        const connection = await db.getConnection();  // Pega conexão para transação
        try {
            await connection.beginTransaction();

            // Verifica estoque
            const med = await this.getById(medicamento_id);
            if (!med || med.quantidade <= 0) {
                throw new Error(`O medicamento ${med ? med.nome_medicamento : ''} não possui estoque disponível para retirada.`);
            }

            // Verifica duplicidade
            if (await this.checkIfWithdrawn(email, medicamento_id)) {
                throw new Error(`Este munícipe já retirou o medicamento ${med.nome_medicamento} e não pode retirar novamente.`);
            }

            // Atualiza estoque
            await connection.query(
                'UPDATE medicamentos SET quantidade = quantidade - 1 WHERE id = ?',
                [medicamento_id]
            );

            // Registra retirada
            await connection.query(
                'INSERT INTO retiradas (email_municipe, medicamento_id) VALUES (?, ?)',
                [email, medicamento_id]
            );

            await connection.commit();
            return med;
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }
}

module.exports = Medicamento;