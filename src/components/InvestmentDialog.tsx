import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/apiService';
import { InvestmentPlan } from '@/types';

interface InvestmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlan?: InvestmentPlan;
}

interface BackendInvestmentPlan {
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

const InvestmentDialog: React.FC<InvestmentDialogProps> = ({ open, onOpenChange, selectedPlan }) => {
  const [amount, setAmount] = useState('');
  const [planId, setPlanId] = useState(selectedPlan?.id || '');
  const [investmentPlans, setInvestmentPlans] = useState<BackendInvestmentPlan[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchInvestmentPlans = async () => {
      try {
        const plans = await apiService.getInvestmentPlans();
        setInvestmentPlans(plans);
        if (selectedPlan) {
          setPlanId(selectedPlan.id.toString());
        }
      } catch (error) {
        console.error('Error fetching investment plans:', error);
        toast({
          title: "Erro ao carregar planos",
          description: "Não foi possível carregar os planos de investimento.",
          variant: "destructive",
        });
      }
    };
    
    if (open) {
      fetchInvestmentPlans();
    }
  }, [open, selectedPlan, toast]);

  const selectedPlanData = investmentPlans.find(p => p.id.toString() === planId);

  const calculateReturns = () => {
    if (!amount || !selectedPlanData) return null;
    
    const investment = parseFloat(amount);
    const dailyReturnRate = selectedPlanData.daily_return;
    const totalReturnRate = selectedPlanData.total_return;
    
    const dailyReturn = (investment * dailyReturnRate) / 100;
    const totalReturn = (investment * totalReturnRate) / 100;
    
    return {
      daily: dailyReturn,
      total: totalReturn,
      finalAmount: investment + totalReturn
    };
  };

  const returns = calculateReturns();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !planId) {
      toast({
        title: "Informações incompletas",
        description: "Por favor, selecione um plano e insira um valor.",
        variant: "destructive"
      });
      return;
    }

    const investmentAmount = parseFloat(amount);
    const plan = selectedPlanData;
    
    if (!plan) {
      toast({
        title: "Plano não encontrado",
        description: "O plano selecionado não foi encontrado.",
        variant: "destructive"
      });
      return;
    }

    if (investmentAmount < plan.min_amount || investmentAmount > plan.max_amount) {
      toast({
        title: "Valor inválido",
        description: `O valor deve estar entre $${plan.min_amount} e $${plan.max_amount}.`,
        variant: "destructive"
      });
      return;
    }

    if (investmentAmount > (user?.balance || 0)) {
      toast({
        title: "Saldo insuficiente",
        description: "Você não tem saldo suficiente para este investimento.",
        variant: "destructive"
      });
      return;
    }

    try {
      await apiService.createInvestment({
        planId: parseInt(planId),
        amount: investmentAmount
      });

      toast({
        title: "Investimento criado!",
        description: `Investimento de $${amount} no ${plan.name} criado com sucesso!`,
      });

      onOpenChange(false);
      setAmount('');
      setPlanId('');
    } catch (error) {
      console.error('Error creating investment:', error);
      toast({
        title: "Erro ao criar investimento",
        description: "Não foi possível criar o investimento. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Criar Novo Investimento</DialogTitle>
          <DialogDescription>
            Escolha seu plano de investimento e valor para começar.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plan">Plano de Investimento</Label>
              <Select value={planId} onValueChange={setPlanId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um plano" />
                </SelectTrigger>
                <SelectContent>
                  {investmentPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id.toString()}>
                      {plan.name} - {plan.daily_return}% diário
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="amount">Valor do Investimento</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Digite o valor"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={selectedPlanData?.min_amount}
                max={selectedPlanData?.max_amount}
              />
              {selectedPlanData && (
                <p className="text-xs text-muted-foreground mt-1">
                  Faixa: ${selectedPlanData.min_amount.toLocaleString()} - ${selectedPlanData.max_amount.toLocaleString()}
                </p>
              )}
            </div>
          </div>

          {selectedPlanData && (
            <Card className="bg-muted/20">
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-3">{selectedPlanData.name}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Retorno Diário</p>
                    <p className="font-medium">{selectedPlanData.daily_return}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duração</p>
                    <p className="font-medium">{selectedPlanData.duration} dias</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Retorno Total</p>
                    <p className="font-medium">{selectedPlanData.total_return}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium text-success">Ativo</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground">{selectedPlanData.description}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {returns && (
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-3">Retornos Projetados</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Ganhos Diários</p>
                    <p className="font-bold text-success">${returns.daily.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Lucro Total</p>
                    <p className="font-bold text-accent">${returns.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Valor Final</p>
                    <p className="font-bold text-primary">${returns.finalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex space-x-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Criar Investimento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentDialog;