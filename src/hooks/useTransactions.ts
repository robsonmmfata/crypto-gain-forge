import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';

interface Transaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  hash?: string;
  created_at: string;
  completed_at?: string;
}

interface TransactionStats {
  total_transactions: number;
  total_deposits: number;
  total_withdrawals: number;
  total_investments: number;
  total_earnings: number;
}

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async (limit: number = 50) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getTransactionHistory(limit);
      setTransactions(data || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Falha ao carregar transações');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionStats = async () => {
    try {
      const data = await apiService.getTransactionStats();
      setStats(data || null);
    } catch (err) {
      console.error('Error fetching transaction stats:', err);
      setStats(null);
    }
  };

  const getTransactionDetails = async (transactionId: string) => {
    try {
      const data = await apiService.getTransactionDetails(transactionId);
      return data;
    } catch (err) {
      console.error('Error fetching transaction details:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchTransactionStats();
  }, []);

  return {
    transactions,
    stats,
    loading,
    error,
    fetchTransactions,
    fetchTransactionStats,
    getTransactionDetails,
    refresh: () => {
      fetchTransactions();
      fetchTransactionStats();
    }
  };
};