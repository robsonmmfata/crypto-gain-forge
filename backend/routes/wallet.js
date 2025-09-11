const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Buscar saldo do usuário
router.get('/balance', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      balance: user.balance,
      currency: 'USDT' // Por enquanto, apenas USDT
    });
  } catch (error) {
    console.error('Erro ao buscar saldo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar carteira específica (por enquanto retorna apenas USDT)
router.get('/:currency', async (req, res) => {
  try {
    const { currency } = req.params;

    if (currency.toUpperCase() !== 'USDT') {
      return res.status(404).json({ error: 'Moeda não suportada' });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      wallet: {
        currency: 'USDT',
        balance: user.balance,
        address: process.env.BINANCE_USDT_ADDRESS || 'TLbVGmYfgYLRk72KwxZALL6Scj9ona1Z5j'
      }
    });
  } catch (error) {
    console.error('Erro ao buscar carteira:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar endereço da carteira (simulado)
router.put('/:currency/address', async (req, res) => {
  try {
    const { currency } = req.params;
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: 'Endereço é obrigatório' });
    }

    if (currency.toUpperCase() !== 'USDT') {
      return res.status(400).json({ error: 'Moeda não suportada' });
    }

    // Por enquanto, apenas simula a atualização
    res.json({
      message: 'Endereço atualizado com sucesso',
      wallet: {
        currency: 'USDT',
        address: address
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar endereço:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar estatísticas da carteira
router.get('/stats/overview', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const userStats = await Transaction.getUserStats(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Investimentos ativos (usando modelo Investment)
    const activeInvestments = await Investment.findActiveByUserId(req.user.id);

    res.json({
      totalBalance: user.balance,
      activeInvestments: activeInvestments.length,
      todayEarnings: userStats.today_earnings || 0,
      totalEarnings: userStats.total_earnings || 0,
      pendingWithdrawals: userStats.pending_withdrawals || 0
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar histórico de saldo
router.get('/balance/history', async (req, res) => {
  try {
    const { months = 6 } = req.query;

    // Buscar transações do usuário
    const transactions = await Transaction.findByUserId(req.user.id, 1000);

    // Agrupar por mês (implementação simplificada)
    const monthlyData = {};
    const currentDate = new Date();

    for (let i = 0; i < months; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
      monthlyData[monthKey] = { deposits: 0, withdrawals: 0 };
    }

    // Calcular totais mensais
    transactions.forEach(transaction => {
      const monthKey = transaction.created_at.toISOString().slice(0, 7);
      if (monthlyData[monthKey]) {
        if (transaction.type === 'deposit') {
          monthlyData[monthKey].deposits += parseFloat(transaction.amount);
        } else if (transaction.type === 'withdrawal') {
          monthlyData[monthKey].withdrawals += parseFloat(transaction.amount);
        }
      }
    });

    // Converter para array
    const balanceHistory = Object.keys(monthlyData)
      .sort()
      .map(month => ({
        month: month,
        net_change: monthlyData[month].deposits - monthlyData[month].withdrawals
      }));

    res.json({ balanceHistory });
  } catch (error) {
    console.error('Erro ao buscar histórico de saldo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
