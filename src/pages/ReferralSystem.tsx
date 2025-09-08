import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Users, Gift, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ReferralSystem: React.FC = () => {
  const { toast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://connectpay.app/ref/user123');
    toast({
      title: "Link copiado!",
      description: "Link de indicação copiado para a área de transferência",
    });
  };

  const handleMoreWays = () => {
    toast({
      title: "Mais maneiras",
      description: "Explorando outras formas de ganhar",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Button variant="ghost" size="sm">
            ← Sistema de Indicações
          </Button>
          <Button variant="default" size="sm" className="ml-auto">
            Regras
          </Button>
        </div>
      </div>

      {/* Level Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-8 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground mb-2">
              Lv.1
            </div>
            <div className="text-sm font-medium">8%</div>
            <div className="text-xs text-muted-foreground">Nível 1</div>
            <div className="text-xs text-muted-foreground">Rewards: 4%</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-2">
              Lv.2
            </div>
            <div className="text-sm font-medium">3%</div>
            <div className="text-xs text-muted-foreground">Nível 2</div>
            <div className="text-xs text-muted-foreground">Rewards: 1.5%</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-2">
              Lv.3
            </div>
            <div className="text-sm font-medium">1%</div>
            <div className="text-xs text-muted-foreground">Nível 3</div>
            <div className="text-xs text-muted-foreground">Rewards: 0.5%</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">0.00</div>
            <div className="text-sm text-muted-foreground">Valor da Comissão (USDT)</div>
            <Button variant="outline" size="sm" className="mt-2">
              Retirar →
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">0.00</div>
            <div className="text-sm text-muted-foreground">Comissão total (USDT)</div>
            <div className="text-xs text-success mt-1">Detalhes</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-muted-foreground">Número de convites</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">0.00</div>
            <div className="text-sm text-muted-foreground">Investimento total (USDT)</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="text-2xl font-bold mb-2">Primeiros Depósitos de Nível 1 (USDT)</div>
            <div className="text-4xl font-bold text-primary">0.00</div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Button 
          onClick={handleCopyLink}
          className="h-12 bg-success hover:bg-success-hover text-success-foreground"
        >
          <Copy className="w-5 h-5 mr-2" />
          Copiar link
        </Button>
        
        <Button 
          onClick={handleMoreWays}
          variant="outline" 
          className="h-12 border-warning text-warning hover:bg-warning hover:text-warning-foreground"
        >
          <Gift className="w-5 h-5 mr-2" />
          Mais maneiras
        </Button>
      </div>

      {/* Today/Total Toggle */}
      <div className="mb-6">
        <div className="flex bg-card rounded-lg p-1">
          <Button variant="default" className="flex-1">
            Hoje
          </Button>
          <Button variant="ghost" className="flex-1">
            Total
          </Button>
        </div>
        <div className="text-right mt-2">
          <span className="text-sm text-muted-foreground">Detalhes →</span>
        </div>
      </div>

      {/* Levels Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-sm">Dados</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-sm">Nível 1</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-sm">Nível 2</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-sm">Nível 3</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Details Grid */}
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div className="font-medium">Comissão</div>
          <div className="text-center">0.00</div>
          <div className="text-center">0.00</div>
          <div className="text-center">0.00</div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div className="font-medium">Número de investidores</div>
          <div className="text-center">0</div>
          <div className="text-center">0</div>
          <div className="text-center">0</div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div className="font-medium">Número de depositantes</div>
          <div className="text-center">0</div>
          <div className="text-center">0</div>
          <div className="text-center">0</div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div className="font-medium">Usuários cadastrados</div>
          <div className="text-center">0</div>
          <div className="text-center">0</div>
          <div className="text-center">0</div>
        </div>
      </div>
    </div>
  );
};

export default ReferralSystem;