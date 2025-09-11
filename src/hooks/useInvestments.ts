import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

interface Investment {
  id: string;
  plan_id: number;
  amount: number;
  daily_return: number;
  total_return: number;
  duration: number;
  status: string;
  earnings: number;
  created_at: string;
  completed_at?: string;
  plan_name?: string;
}

interface InvestmentPlan {
  id: number;
  name: string;
  description: string;
  min_amount: number;
  max_amount: number;
  daily_return: number;
  total_return: number;
  duration: number;
  is_active: boolean;
}

export const useInvestments = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [investmentPlans, setInvestmentPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getUserInvestments();
      setInvestments(data || []);
    } catch (err) {
      console.error('Error fetching investments:', err);
      setError('Falha ao carregar investimentos');
      setInvestments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvestmentPlans = async () => {
    try {
      const data = await apiService.getInvestmentPlans();
      setInvestmentPlans(data || []);
    } catch (err) {
      console.error('Error fetching investment plans:', err);
      setInvestmentPlans([]);
    }
  };

  const createInvestment = async (planId: number, amount: number) => {
    try {
      const result = await apiService.createInvestment({ planId, amount });
      toast({
        title: "Investimento criado!",
        description: "Seu investimento foi criado com sucesso.",
      });
      
      // Refresh investments
      await fetchInvestments();
      return result;
    } catch (err) {
      console.error('Error creating investment:', err);
      toast({
        title: "Erro ao criar investimento",
        description: "Não foi possível criar o investimento.",
        variant: "destructive"
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchInvestments();
    fetchInvestmentPlans();
  }, []);

  return {
    investments,
    investmentPlans,
    loading,
    error,
    fetchInvestments,
    fetchInvestmentPlans,
    createInvestment,
    refresh: () => {
      fetchInvestments();
      fetchInvestmentPlans();
    }
  };
};