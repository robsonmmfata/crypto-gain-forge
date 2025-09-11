import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import PlanCard from '@/components/PlanCard';
import { apiService } from '@/services/apiService';
import { InvestmentPlan } from '@/types';
import { useToast } from '@/hooks/use-toast';

const InvestmentPlans: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [investmentPlans, setInvestmentPlans] = useState<InvestmentPlan[]>([]);

  useEffect(() => {
    const fetchInvestmentPlans = async () => {
      try {
        const plans = await apiService.getInvestmentPlans();
        setInvestmentPlans(plans);
      } catch (error) {
        toast({
          title: "Erro ao carregar planos",
          description: "Não foi possível carregar os planos de investimento.",
          variant: "destructive",
        });
      }
    };
    fetchInvestmentPlans();
  }, []);

  const handleInvest = (plan: InvestmentPlan) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to start investing.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    toast({
      title: "Investment Started",
      description: `You have successfully invested in ${plan.name}!`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-elevated">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Investment Plans
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect investment plan that matches your goals and risk tolerance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {investmentPlans.map((plan, index) => (
            <PlanCard 
              key={plan.id} 
              plan={plan} 
              onInvest={handleInvest}
              featured={index === 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestmentPlans;
