const express = require('express');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Buscar transações do usuário
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status, currency } = req.query;
    const offset = (page - 1) * limit;

    // Por enquanto, usar implementação simplificada sem filtros avançados
    const transactions = await Transaction.findByUserId(req.user.id, parseInt(limit));

    // Filtrar manualmente (implementação básica)
    let filteredTransactions = transactions;

    if (type) {
      filteredTransactions = filteredTransactions.filter(t => t.type === type);
    }

    if (status) {
      filteredTransactions = filteredTransactions.filter(t => t.status === status);
    }

    if (currency) {
      filteredTransactions = filteredTransactions.filter(t => t.currency === currency.toUpperCase());
    }

    // Aplicar paginação
    const paginatedTransactions = filteredTransactions.slice(offset, offset + parseInt(limit));

    res.json({
      transactions: paginatedTransactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredTransactions.length,
        pages: Math.ceil(filteredTransactions.length / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar transação específica
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);

    if (!transaction || transaction.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    res.json({ transaction });
  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar depósito
router.post('/deposit', async (req, res) => {
  try {
    const { amount, currency, description } = req.body;

    if (!amount || !currency) {
      return res.status(400).json({ error: 'Valor e moeda são obrigatórios' });
    }

    if (parseFloat(amount) <= 0) {
      return res.status(400).json({ error: 'Valor deve ser maior que zero' });
    }

    // Criar transação de depósito
    const transaction = await Transaction.create({
      user_id: req.user.id,
      type: 'deposit',
      amount: parseFloat(amount),
      currency: currency.toUpperCase(),
      status: 'pending',
      description: description || 'Depósito via Binance'
    });

    res.status(201).json({
      message: 'Depósito criado com sucesso',
      transaction
    });
  } catch (error) {
    console.error('Erro ao criar depósito:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar retirada
router.post('/withdraw', async (req, res) => {
  try {
    const { amount, currency, address, description } = req.body;

    if (!amount || !currency || !address) {
      return res.status(400).json({ error: 'Valor, moeda e endereço são obrigatórios' });
    }

    if (parseFloat(amount) <= 0) {
      return res.status(400).json({ error: 'Valor deve ser maior que zero' });
    }

    // Verificar saldo disponível
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (user.balance < parseFloat(amount)) {
      return res.status(400).json({ error: 'Saldo insuficiente' });
    }

    // Criar transação de retirada
    const transaction = await Transaction.create({
      user_id: req.user.id,
      type: 'withdrawal',
      amount: parseFloat(amount),
      currency: currency.toUpperCase(),
      status: 'pending',
      description: description || `Retirada para ${address}`
    });

    res.status(201).json({
      message: 'Retirada criada com sucesso',
      transaction
    });
  } catch (error) {
    console.error('Erro ao criar retirada:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Confirmar transação (usado internamente ou por admin)
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['completed', 'failed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    const transaction = await Transaction.findById(id);

    if (!transaction || transaction.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    // Atualizar status
    const updatedTransaction = await Transaction.updateStatus(id, status);

    // Se for depósito completado, atualizar saldo
    if (status === 'completed' && transaction.type === 'deposit') {
      await User.updateBalance(req.user.id, transaction.amount);
    }

    // Se for retirada completada, debitar saldo
    if (status === 'completed' && transaction.type === 'withdrawal') {
      await User.updateBalance(req.user.id, -transaction.amount);
    }

    res.json({
      message: 'Status da transação atualizado com sucesso',
      transaction: updatedTransaction
    });
  } catch (error) {
    console.error('Erro ao atualizar status da transação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
