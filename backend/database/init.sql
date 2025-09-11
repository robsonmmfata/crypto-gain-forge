-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS cryptogain_db;

-- Usar o banco
\c cryptogain_db;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de carteiras
CREATE TABLE IF NOT EXISTS wallets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  currency VARCHAR(10) NOT NULL DEFAULT 'USDT',
  balance DECIMAL(20, 8) DEFAULT 0,
  available_balance DECIMAL(20, 8) DEFAULT 0,
  locked_balance DECIMAL(20, 8) DEFAULT 0,
  address VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, currency)
);

-- Tabela de planos de investimento
CREATE TABLE IF NOT EXISTS investment_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  min_amount DECIMAL(20, 8) NOT NULL,
  max_amount DECIMAL(20, 8) NOT NULL,
  daily_return DECIMAL(5, 2) NOT NULL,
  duration INTEGER NOT NULL,
  total_return DECIMAL(5, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  description TEXT,
  features JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de investimentos
CREATE TABLE IF NOT EXISTS investments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  plan_id INTEGER REFERENCES investment_plans(id),
  amount DECIMAL(20, 8) NOT NULL,
  daily_return DECIMAL(5, 2) NOT NULL,
  total_return DECIMAL(5, 2) NOT NULL,
  duration INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  last_earning_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de transações
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL, -- deposit, withdrawal, investment, earning
  amount DECIMAL(20, 8) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USDT',
  status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed
  tx_hash VARCHAR(255),
  address VARCHAR(255),
  network VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL
);

-- Tabela de histórico de preços (para gráficos)
CREATE TABLE IF NOT EXISTS price_history (
  id SERIAL PRIMARY KEY,
  symbol VARCHAR(20) NOT NULL,
  price DECIMAL(20, 8) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON investments(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_price_history_symbol_timestamp ON price_history(symbol, timestamp);

-- Inserir dados iniciais
INSERT INTO investment_plans (name, min_amount, max_amount, daily_return, duration, total_return, description, features) VALUES
('Plano Starter', 100, 1000, 1.2, 30, 36, 'Perfeito para iniciantes', '["Retorno diário", "Retiradas instantâneas", "Suporte básico"]'),
('Plano Professional', 1000, 10000, 1.8, 45, 81, 'Estratégias avançadas', '["Retorno diário", "Retiradas prioritárias", "Suporte prioritário"]'),
('VIP Elite', 10000, 100000, 2.5, 60, 150, 'Plano exclusivo', '["Retorno diário", "Retiradas instantâneas", "Gerente dedicado"]')
ON CONFLICT DO NOTHING;
