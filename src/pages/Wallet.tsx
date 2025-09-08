import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, EyeOff, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'reward';
  amount: string;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

const Wallet: React.FC = () => {
  const { toast } = useToast();
  const [showBalance, setShowBalance] = useState(false);
  const [transactions] = useState<Transaction[]>([]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText('5518991176034');
    toast({
      title: "Endereço copiado!",
      description: "Endereço da carteira copiado para a área de transferência",
    });
  };

  const handleWithdraw = () => {
    toast({
      title: "Retirada",
      description: "Abrindo formulário de retirada",
    });
  };

  const handleDeposit = () => {
    toast({
      title: "Depósito",
      description: "Abrindo formulário de depósito",
    });
  };

  const handleCoupons = () => {
    toast({
      title: "Meus cupons",
      description: "Visualizando cupons disponíveis",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Address */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-primary text-lg font-medium">$</span>
          <span className="text-foreground">5518991176034</span>
          <Button variant="ghost" size="sm" onClick={handleCopyAddress}>
            <Copy className="w-4 h-4" />
            Copiar
          </Button>
        </div>
      </div>

      {/* Balance Card */}
      <div className="p-6">
        <Card className="bg-gradient-to-br from-surface to-surface-elevated border-0 mb-6">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Ativos totais (USDT)</div>
                <div className="text-4xl font-bold text-foreground flex items-center space-x-2">
                  <span>{showBalance ? '0,0000' : '****'}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBalance(!showBalance)}
                  >
                    {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-2">Desconto (USDT)</div>
                <div className="text-2xl font-bold text-foreground">0,00</div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button 
                onClick={handleWithdraw}
                variant="outline" 
                className="flex-1 h-12 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Retirada
              </Button>
              <Button 
                onClick={handleDeposit}
                className="flex-1 h-12 bg-primary hover:bg-primary-hover text-primary-foreground"
              >
                Depósito
              </Button>
              <Button 
                onClick={handleCoupons}
                variant="outline" 
                className="flex-1 h-12 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Meus cupons
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Promo Banner */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary to-warning rounded-lg p-6 text-primary-foreground mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold mb-2">A BEEFUND NÃO VOLTOU...</div>
                <div className="text-xl font-bold">ELA RENASCEU.</div>
                <div className="text-sm mt-2">MAIS FORTE, MAIS JUSTA, MAIS LUCRATIVA.</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">Até 1000!</div>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Transações recentes</h2>
            <Button variant="ghost" size="sm" className="text-primary">
              Mais detalhes →
            </Button>
          </div>

          {transactions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground mb-4">
                  <Gift className="w-12 h-12 mx-auto mb-2 opacity-50" />
                </div>
                <p className="text-muted-foreground">Nenhuma transação encontrada.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {transactions.map((transaction) => (
                <Card key={transaction.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'deposit' ? 'bg-success/20 text-success' :
                          transaction.type === 'withdrawal' ? 'bg-destructive/20 text-destructive' :
                          'bg-warning/20 text-warning'
                        }`}>
                          {transaction.type === 'deposit' ? '↓' : 
                           transaction.type === 'withdrawal' ? '↑' : '★'}
                        </div>
                        <div>
                          <div className="font-medium capitalize">{transaction.type}</div>
                          <div className="text-sm text-muted-foreground">{transaction.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${
                          transaction.type === 'deposit' || transaction.type === 'reward' 
                            ? 'text-success' : 'text-destructive'
                        }`}>
                          {transaction.type === 'withdrawal' ? '-' : '+'}
                          {transaction.amount} {transaction.currency}
                        </div>
                        <Badge variant={
                          transaction.status === 'completed' ? 'default' :
                          transaction.status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;