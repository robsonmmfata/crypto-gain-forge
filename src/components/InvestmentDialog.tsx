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

const InvestmentDialog: React.FC<InvestmentDialogProps> = ({ open, onOpenChange, selectedPlan }) => {
  const [amount, setAmount] = useState('');
  const [planId, setPlanId] = useState(selectedPlan?.id || '');
  const [investmentPlans, setInvestmentPlans] = useState<InvestmentPlan[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

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

  const selectedPlanData = investmentPlans.find(p => p.id === planId) || selectedPlan;

  const calculateReturns = () => {
    if (!amount || !selectedPlanData) return null;
    
    const investment = parseFloat(amount);
    const dailyReturn = (investment * selectedPlanData.dailyReturn) / 100;
    const totalReturn = (investment * selectedPlanData.totalReturn) / 100;
    
    return {
      daily: dailyReturn,
      total: totalReturn,
      finalAmount: investment + totalReturn
    };
  };

  const returns = calculateReturns();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !planId) {
      toast({
        title: "Missing Information",
        description: "Please select a plan and enter an amount.",
        variant: "destructive"
      });
      return;
    }

    const investmentAmount = parseFloat(amount);
    const plan = selectedPlanData;
    
    if (!plan) return;

    if (investmentAmount < plan.minAmount || investmentAmount > plan.maxAmount) {
      toast({
        title: "Invalid Amount",
        description: `Amount must be between $${plan.minAmount} and $${plan.maxAmount}.`,
        variant: "destructive"
      });
      return;
    }

    if (investmentAmount > (user?.balance || 0)) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this investment.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Investment Created",
      description: `Successfully invested $${amount} in ${plan.name}!`,
    });

    onOpenChange(false);
    setAmount('');
    setPlanId('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Investment</DialogTitle>
          <DialogDescription>
            Choose your investment plan and amount to get started.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plan">Investment Plan</Label>
              <Select value={planId} onValueChange={setPlanId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {investmentPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} - {plan.dailyReturn}% daily
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="amount">Investment Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={selectedPlanData?.minAmount}
                max={selectedPlanData?.maxAmount}
              />
              {selectedPlanData && (
                <p className="text-xs text-muted-foreground mt-1">
                  Range: ${selectedPlanData.minAmount.toLocaleString()} - ${selectedPlanData.maxAmount.toLocaleString()}
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
                    <p className="text-muted-foreground">Daily Return</p>
                    <p className="font-medium">{selectedPlanData.dailyReturn}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-medium">{selectedPlanData.duration} days</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Return</p>
                    <p className="font-medium">{selectedPlanData.totalReturn}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium text-success">Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {returns && (
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-3">Projected Returns</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Daily Earnings</p>
                    <p className="font-bold text-success">${returns.daily.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Profit</p>
                    <p className="font-bold text-accent">${returns.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Final Amount</p>
                    <p className="font-bold text-primary">${returns.finalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex space-x-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Investment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentDialog;