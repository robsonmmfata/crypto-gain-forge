const pool = require('./config/database');

const createTables = async () => {
  try {
    // Dropar tabelas existentes se necessário
    await pool.query('DROP TABLE IF EXISTS user_investments CASCADE');
    await pool.query('DROP TABLE IF EXISTS transactions CASCADE');
    await pool.query('DROP TABLE IF EXISTS users CASCADE');
    await pool.query('DROP TABLE IF EXISTS investment_plans CASCADE');
    await pool.query('DROP TABLE IF EXISTS settings CASCADE');

    // Criar tabela de usuários
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        phone VARCHAR(20),
        is_admin BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        balance_usdt DECIMAL(20,8) DEFAULT 0,
        total_invested DECIMAL(20,8) DEFAULT 0,
        total_earnings DECIMAL(20,8) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar tabela de planos de investimento
    await pool.query(`
      CREATE TABLE IF NOT EXISTS investment_plans (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        min_amount DECIMAL(20,8) NOT NULL,
        max_amount DECIMAL(20,8) NOT NULL,
        daily_return DECIMAL(5,2) NOT NULL,
        duration INTEGER NOT NULL,
        total_return DECIMAL(5,2) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        description TEXT,
        features JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar tabela de investimentos dos usuários
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_investments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        plan_id INTEGER REFERENCES investment_plans(id) ON DELETE CASCADE,
        amount DECIMAL(20,8) NOT NULL,
        daily_return DECIMAL(5,2) NOT NULL,
        total_return DECIMAL(5,2) NOT NULL,
        duration INTEGER NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      )
    `);

    // Criar tabela de transações
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(20) NOT NULL,
        amount DECIMAL(20,8) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USDT',
        status VARCHAR(20) DEFAULT 'pending',
        description TEXT,
        tx_hash VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      )
    `);

    // Criar tabela de configurações
    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(50) UNIQUE NOT NULL,
        value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Inserir dados iniciais
    await insertInitialData();

    console.log('Tabelas criadas com sucesso!');
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
  }
};

const insertInitialData = async () => {
  try {
    // Inserir planos de investimento
    const plans = [
      {
        name: 'Starter Plan',
        min_amount: 100,
        max_amount: 1000,
        daily_return: 1.2,
        duration: 30,
        total_return: 36,
        description: 'Perfeito para iniciantes',
        features: JSON.stringify(['Retorno diário', 'Retiradas instantâneas', 'Suporte básico'])
      },
      {
        name: 'Professional Plan',
        min_amount: 1000,
        max_amount: 10000,
        daily_return: 1.8,
        duration: 45,
        total_return: 81,
        description: 'Estratégias avançadas',
        features: JSON.stringify(['Retorno diário', 'Retiradas prioritárias', 'Suporte prioritário'])
      },
      {
        name: 'VIP Elite',
        min_amount: 10000,
        max_amount: 100000,
        daily_return: 2.5,
        duration: 60,
        total_return: 150,
        description: 'Plano exclusivo',
        features: JSON.stringify(['Retorno diário', 'Retiradas instantâneas', 'Gerente dedicado'])
      }
    ];

    for (const plan of plans) {
      const existingPlan = await pool.query('SELECT id FROM investment_plans WHERE name = $1', [plan.name]);
      if (existingPlan.rows.length === 0) {
        await pool.query(`
          INSERT INTO investment_plans (name, min_amount, max_amount, daily_return, duration, total_return, description, features)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [plan.name, plan.min_amount, plan.max_amount, plan.daily_return, plan.duration, plan.total_return, plan.description, plan.features]);
      }
    }

    // Inserir usuários de teste
    const bcrypt = require('bcryptjs');
    const hashedAdminPassword = await bcrypt.hash('password123', 10);
    const hashedUserPassword = await bcrypt.hash('password123', 10);

    // Verificar se usuários já existem antes de inserir
    const existingAdmin = await pool.query('SELECT id FROM users WHERE email = $1', ['admin@cryptovault.com']);
    if (existingAdmin.rows.length === 0) {
      await pool.query(`
        INSERT INTO users (email, password_hash, full_name, is_admin, balance_usdt)
        VALUES ($1, $2, $3, $4, $5)
      `, ['admin@cryptovault.com', hashedAdminPassword, 'Admin User', true, 10000]);
    }

    const existingInvestor = await pool.query('SELECT id FROM users WHERE email = $1', ['investor@example.com']);
    if (existingInvestor.rows.length === 0) {
      await pool.query(`
        INSERT INTO users (email, password_hash, full_name, is_admin, balance_usdt)
        VALUES ($1, $2, $3, $4, $5)
      `, ['investor@example.com', hashedUserPassword, 'Test Investor', false, 5000]);
    }

    // Inserir configurações padrão
    const settings = [
      { key: 'min_deposit', value: '10' },
      { key: 'max_deposit', value: '100000' },
      { key: 'min_withdrawal', value: '20' },
      { key: 'withdrawal_fee', value: '1' },
      { key: 'daily_earnings_calculation', value: 'true' }
    ];

    for (const setting of settings) {
      const existingSetting = await pool.query('SELECT id FROM settings WHERE key = $1', [setting.key]);
      if (existingSetting.rows.length === 0) {
        await pool.query(`
          INSERT INTO settings (key, value)
          VALUES ($1, $2)
        `, [setting.key, setting.value]);
      }
    }

    console.log('Dados iniciais inseridos!');
    console.log('Credenciais de teste:');
    console.log('Admin: admin@cryptovault.com / password123');
    console.log('User: investor@example.com / password123');
  } catch (error) {
    console.error('Erro ao inserir dados iniciais:', error);
  }
};

module.exports = { createTables };
