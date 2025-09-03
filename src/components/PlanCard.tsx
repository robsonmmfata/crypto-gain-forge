import React from 'react';
import { InvestmentPlan } from '@/types';
import { Button } from './ui/button';
import { CheckCircle, Star } from 'lucide-react';

interface PlanCardProps {
  plan: InvestmentPlan;
  onInvest: (plan: InvestmentPlan) => void;
  featured?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onInvest, featured = false }) => {
  return (
    <div className={`relative bg-gradient-to-b ${
      featured 
        ? 'from-card via-card to-surface-elevated border-primary/50 shadow-[var(--glow-primary)]' 
        : 'from-card to-surface border-card-border'
    } border rounded-2xl p-6 hover:scale-105 transition-all duration-300`}>
      
      {featured && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
            <Star className="w-4 h-4 mr-1" />
            Most Popular
          </div>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
        <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
        
        <div className="bg-gradient-to-r from-success/10 to-accent/10 border border-success/20 rounded-xl p-4 mb-4">
          <div className="text-3xl font-bold text-success mb-1">
            {plan.dailyReturn}%
          </div>
          <div className="text-sm text-muted-foreground">Daily Return</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              ${plan.minAmount.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Min Investment</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {plan.duration} Days
            </div>
            <div className="text-xs text-muted-foreground">Duration</div>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="text-2xl font-bold text-accent">
            {plan.totalReturn}%
          </div>
          <div className="text-sm text-muted-foreground">Total Return</div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-center text-sm">
            <CheckCircle className="w-4 h-4 text-success mr-3 flex-shrink-0" />
            <span className="text-muted-foreground">{feature}</span>
          </div>
        ))}
      </div>

      <Button 
        variant={featured ? "hero" : "investment"}
        size="lg"
        className="w-full"
        onClick={() => onInvest(plan)}
      >
        Invest Now
      </Button>

      <div className="text-center mt-4">
        <p className="text-xs text-muted-foreground">
          Range: ${plan.minAmount.toLocaleString()} - ${plan.maxAmount.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default PlanCard;