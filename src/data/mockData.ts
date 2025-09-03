import { InvestmentPlan, Investment, Transaction, DashboardStats } from '@/types';

export const mockInvestmentPlans: InvestmentPlan[] = [
  {
    id: '1',
    name: 'Starter Plan',
    minAmount: 100,
    maxAmount: 1000,
    dailyReturn: 1.2,
    duration: 30,
    totalReturn: 36,
    isActive: true,
    description: 'Perfect for beginners looking to start their investment journey',
    features: [
      'Daily compounding',
      'Instant withdrawals',
      'Email notifications',
      'Basic support'
    ]
  },
  {
    id: '2',
    name: 'Professional Plan',
    minAmount: 1000,
    maxAmount: 10000,
    dailyReturn: 1.8,
    duration: 45,
    totalReturn: 81,
    isActive: true,
    description: 'Advanced strategies for experienced investors',
    features: [
      'Daily compounding',
      'Priority withdrawals',
      'SMS + Email notifications',
      'Priority support',
      'Monthly reports',
      'Risk management tools'
    ]
  },
  {
    id: '3',
    name: 'VIP Elite',
    minAmount: 10000,
    maxAmount: 100000,
    dailyReturn: 2.5,
    duration: 60,
    totalReturn: 150,
    isActive: true,
    description: 'Exclusive plan for high-net-worth individuals',
    features: [
      'Daily compounding',
      'Instant withdrawals',
      'All notifications',
      'Dedicated account manager',
      'Weekly reports',
      'Advanced analytics',
      'Exclusive market insights',
      'Custom investment options'
    ]
  }
];

export const mockInvestments: Investment[] = [
  {
    id: '1',
    userId: '2',
    planId: '1',
    amount: 500,
    dailyReturn: 1.2,
    totalReturn: 36,
    duration: 30,
    status: 'active',
    createdAt: '2024-02-01T00:00:00Z'
  },
  {
    id: '2',
    userId: '2',
    planId: '2',
    amount: 2000,
    dailyReturn: 1.8,
    totalReturn: 81,
    duration: 45,
    status: 'active',
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '3',
    userId: '2',
    planId: '1',
    amount: 1000,
    dailyReturn: 1.2,
    totalReturn: 36,
    duration: 30,
    status: 'completed',
    createdAt: '2024-01-01T00:00:00Z',
    completedAt: '2024-01-31T00:00:00Z'
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    userId: '2',
    type: 'deposit',
    amount: 500,
    currency: 'USDT',
    status: 'completed',
    createdAt: '2024-02-01T10:30:00Z',
    completedAt: '2024-02-01T10:45:00Z',
    description: 'Deposit for Starter Plan investment',
    hash: '0x1234567890abcdef'
  },
  {
    id: '2',
    userId: '2',
    type: 'investment',
    amount: 500,
    currency: 'USD',
    status: 'completed',
    createdAt: '2024-02-01T11:00:00Z',
    completedAt: '2024-02-01T11:00:00Z',
    description: 'Investment in Starter Plan'
  },
  {
    id: '3',
    userId: '2',
    type: 'earnings',
    amount: 6,
    currency: 'USD',
    status: 'completed',
    createdAt: '2024-02-02T00:00:00Z',
    completedAt: '2024-02-02T00:00:00Z',
    description: 'Daily earnings from Starter Plan'
  },
  {
    id: '4',
    userId: '2',
    type: 'earnings',
    amount: 36,
    currency: 'USD',
    status: 'completed',
    createdAt: '2024-02-03T00:00:00Z',
    completedAt: '2024-02-03T00:00:00Z',
    description: 'Daily earnings from Professional Plan'
  },
  {
    id: '5',
    userId: '2',
    type: 'withdrawal',
    amount: 200,
    currency: 'BTC',
    status: 'pending',
    createdAt: '2024-02-03T15:30:00Z',
    description: 'Withdrawal request to BTC wallet'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalBalance: 12500,
  totalInvested: 10000,
  todayEarnings: 42,
  totalEarnings: 2500,
  activeInvestments: 2,
  withdrawalsPending: 1
};

// Chart data for dashboard
export const mockEarningsChartData = [
  { date: '2024-01-01', earnings: 12 },
  { date: '2024-01-02', earnings: 18 },
  { date: '2024-01-03', earnings: 24 },
  { date: '2024-01-04', earnings: 32 },
  { date: '2024-01-05', earnings: 28 },
  { date: '2024-01-06', earnings: 35 },
  { date: '2024-01-07', earnings: 42 },
  { date: '2024-01-08', earnings: 38 },
  { date: '2024-01-09', earnings: 45 },
  { date: '2024-01-10', earnings: 52 },
  { date: '2024-01-11', earnings: 48 },
  { date: '2024-01-12', earnings: 55 },
  { date: '2024-01-13', earnings: 62 },
  { date: '2024-01-14', earnings: 58 },
  { date: '2024-01-15', earnings: 65 }
];

export const mockPortfolioData = [
  { name: 'Starter Plan', value: 500, color: 'hsl(var(--primary))' },
  { name: 'Professional Plan', value: 2000, color: 'hsl(var(--success))' },
  { name: 'Available Balance', value: 10000, color: 'hsl(var(--accent))' }
];

export const mockBalanceHistory = [
  { month: 'Jan', balance: 8000 },
  { month: 'Feb', balance: 8500 },
  { month: 'Mar', balance: 9200 },
  { month: 'Apr', balance: 10100 },
  { month: 'May', balance: 11200 },
  { month: 'Jun', balance: 12500 }
];