export interface User {
  id: string;
  email: string;
  name: string;
  balance: number;
  totalInvested: number;
  totalEarnings: number;
  createdAt: string;
  isAdmin?: boolean;
}

export interface Investment {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  dailyReturn: number;
  totalReturn: number;
  duration: number; // days
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  dailyReturn: number; // percentage
  duration: number; // days
  totalReturn: number; // percentage
  isActive: boolean;
  description: string;
  features: string[];
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'earnings' | 'investment';
  amount: number;
  currency: 'BTC' | 'USDT' | 'ETH' | 'USD';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
  description: string;
  hash?: string;
}

export interface DashboardStats {
  totalBalance: number;
  totalInvested: number;
  todayEarnings: number;
  totalEarnings: number;
  activeInvestments: number;
  withdrawalsPending: number;
}