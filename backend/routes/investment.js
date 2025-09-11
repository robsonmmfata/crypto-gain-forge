const express = require('express');
const Investment = require('../models/Investment');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Planos de investimento disponíveis (simulados)
const INVESTMENT_PLANS = [
  {
    id: 1,
    name: 'Plano Básico',
    description: 'Investimento seguro com retorno moderado',
    min_amount: 10,
    max_amount: 1000,
    daily_return: 0.5, // 0.5% ao dia
    total_return: 15, // 15% total
    duration: 30, // 30 dias
    is_active: true
  },
  {
    id: 2,
    name: 'Plano Premium',
    description: 'Investimento com retorno elevado',
    min_amount: 100,
    max_amount: 5000,
    daily_return: 1.0, // 1% ao dia
    total_return: 30, // 30% total
    duration: 30, // 30 dias
    is_active: true
  },
  {
    id: 3,
    name: 'Plano VIP',
    description: 'Investimento de alto rendimento',
    min_amount: 500,
    max_amount: 10000,
    daily_return: 1.5, // 1.5% ao dia
    total_return: 45, // 45% total
    duration: 30, // 30 dias
    is_active: true
  }
];

// Buscar planos de investimento disponíveis
router.get('/plans', async (req, res) => {
  try {
    const plans = INVESTMENT_PLANS.filter(plan => plan.is_active);
    res.json({ plans });
  } catch (error) {
    console.error('Erro ao buscar planos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar plano específico
router.get('/plans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const planId = parseInt(id);

    const plan = INVESTMENT_PLANS.find(p => p.id === planId && p.is_active);

    if (!plan) {
      return res.status(404).json({ error: 'Plano não encontrado' });
    }

    res.json({ plan });
  } catch (error) {
    console.error('Erro ao buscar plano:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar investimentos do usuário
router.get('/', async (req, res) => {
  try {
    const investments = await Investment.findByUserId(req.user.id);

    // Adicionar informações do plano a cada investimento
    const investmentsWithPlans = investments.map(investment => {
      const plan = INVESTMENT_PLANS.find(p => p.id === investment.plan_id);
      return {
        ...investment,
        plan_name: plan ? plan.name : 'Plano não encontrado',
        plan_daily_return: plan ? plan.daily_return : 0,
        plan_duration: plan ? plan.duration : 0,
        plan_description: plan ? plan.description : ''
      };
    });

    res.json({ investments: investmentsWithPlans });
  } catch (error) {
    console.error('Erro ao buscar investimentos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar investimento específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const investment = await Investment.findById(id);

    if (!investment || investment.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Investimento não encontrado' });
    }

    const plan = INVESTMENT_PLANS.find(p => p.id === investment.plan_id);

    const investmentWithPlan = {
      ...investment,
      plan_name: plan ? plan.name : 'Plano não encontrado',
      plan_daily_return: plan ? plan.daily_return : 0,
      plan_duration: plan ? plan.duration : 0,
      plan_description: plan ? plan.description : ''
    };

    res.json({ investment: investmentWithPlan });
  } catch (error) {
    console.error('Erro ao buscar investimento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar novo investimento
router.post('/', async (req, res) => {
  try {
    const { planId, amount } = req.body;

    if (!planId || !amount) {
      return res.status(400).json({ error: 'ID do plano e valor são obrigatórios' });
    }

    const numAmount = parseFloat(amount);
    if (numAmount <= 0) {
      return res.status(400).json({ error: 'Valor deve ser maior que zero' });
    }

    // Verificar plano
    const plan = INVESTMENT_PLANS.find(p => p.id === parseInt(planId) && p.is_active);

    if (!plan) {
      return res.status(404).json({ error: 'Plano não encontrado ou inativo' });
    }

    // Verificar limites do plano
    if (numAmount < plan.min_amount || numAmount > plan.max_amount) {
      return res.status(400).json({
        error: `Valor deve estar entre ${plan.min_amount} e ${plan.max_amount}`
      });
    }

    // Verificar saldo disponível
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (user.balance < numAmount) {
      return res.status(400).json({ error: 'Saldo insuficiente' });
    }

    // Calcular retornos
    const dailyReturn = (numAmount * plan.daily_return) / 100;
    const totalReturn = (numAmount * plan.total_return) / 100;

    // Criar investimento
    const investment = await Investment.create({
      user_id: req.user.id,
      plan_id: parseInt(planId),
      amount: numAmount,
      daily_return: dailyReturn,
      total_return: totalReturn,
      duration: plan.duration,
      status: 'active'
    });

    // Debitar valor da carteira
    await User.updateBalance(req.user.id, -numAmount);

    // Criar transação de investimento
    await Transaction.create({
      user_id: req.user.id,
      type: 'investment',
      amount: numAmount,
      currency: 'USDT',
      status: 'completed',
      description: `Investimento no plano ${plan.name}`
    });

    res.status(201).json({
      message: 'Investimento criado com sucesso',
      investment
    });
  } catch (error) {
    console.error('Erro ao criar investimento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Calcular ganhos diários (deve ser executado diariamente via cron)
router.post('/calculate-daily-earnings', async (req, res) => {
  try {
    // Buscar todos os investimentos ativos
    const activeInvestments = await Investment.findActive();

    let processedCount = 0;

    for (const investment of activeInvestments) {
      // Verificar se já ganhou hoje (simplificado - em produção usaria uma tabela de ganhos diários)
      const today = new Date().toISOString().split('T')[0];

      // Calcular ganho diário
      const dailyEarnings = investment.daily_return;

      // Adicionar aos ganhos totais
      await Investment.updateEarnings(investment.id, dailyEarnings);

      // Creditar na carteira
      await User.updateBalance(investment.user_id, dailyEarnings);

      // Criar transação de ganho
      await Transaction.create({
        user_id: investment.user_id,
        type: 'earnings',
        amount: dailyEarnings,
        currency: 'USDT',
        status: 'completed',
        description: `Ganhos diários - Investimento ID: ${investment.id}`
      });

      processedCount++;
    }

    res.json({
      message: `Ganhos diários calculados para ${processedCount} investimentos`,
      processed: processedCount
    });
  } catch (error) {
    console.error('Erro ao calcular ganhos diários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Finalizar investimento
router.put('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;

    const investment = await Investment.findById(id);

    if (!investment || investment.user_id !== req.user.id || investment.status !== 'active') {
      return res.status(404).json({ error: 'Investimento não encontrado ou já finalizado' });
    }

    // Calcular valor total a devolver (capital + ganhos)
    const totalReturn = investment.amount + investment.earnings;

    // Atualizar investimento
    await Investment.updateStatus(id, 'completed');

    // Creditar valor total na carteira
    await User.updateBalance(req.user.id, totalReturn);

    // Criar transação de retorno de investimento
    await Transaction.create({
      user_id: req.user.id,
      type: 'investment_return',
      amount: totalReturn,
      currency: 'USDT',
      status: 'completed',
      description: `Retorno do investimento ID: ${id}`
    });

    res.json({
      message: 'Investimento finalizado com sucesso',
      totalReturn
    });
  } catch (error) {
    console.error('Erro ao finalizar investimento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
