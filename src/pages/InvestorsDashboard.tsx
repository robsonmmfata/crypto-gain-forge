import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, TrendingUp, Users, Award, Clock, DollarSign, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Investor {
  id: string;
  name: string;
  avatar: string;
  previousProfit: string;
  totalProfit: string;
  annualReturn: string;
  days: number;
  status: 'available' | 'limited';
  followers?: number;
}

interface Deposit {
  id: string;
  amount: string;
  date: string;
  status: 'completed' | 'pending' | 'processing';
  method: string;
  txId?: string;
}

const mockInvestors: Investor[] = [
  {
    id: '1',
    name: 'Sabrina Gan',
    avatar: '/avatars/sabrina.jpg',
    previousProfit: '+2.84%',
    totalProfit: '+2.84%',
    annualReturn: '+1038.06%',
    days: 1,
    status: 'available'
  },
  {
    id: '2',
    name: 'Endre Wilson',
    avatar: '/avatars/endre.jpg',
    previousProfit: '+360.20%',
    totalProfit: '+360.20%',
    annualReturn: '+131472.27%',
    days: 90,
    status: 'available'
  },
  {
    id: '3',
    name: 'Austin Garcia',
    avatar: '/avatars/austin.jpg',
    previousProfit: '+900.20%',
    totalProfit: '+900.20%',
    annualReturn: '+328572.64%',
    days: 180,
    status: 'available'
  },
  {
    id: '4',
    name: 'Pepperstone',
    avatar: '/avatars/pepperstone.jpg',
    previousProfit: '+16.50%',
    totalProfit: '+16.50%',
    annualReturn: '+6022.50%',
    days: 7,
    status: 'available'
  },
  {
    id: '5',
    name: 'Anne Richards',
    avatar: '/avatars/anne.jpg',
    previousProfit: '+47.45%',
    totalProfit: '+47.45%',
    annualReturn: '+17318.52%',
    days: 15,
    status: 'available'
  },
  {
    id: '6',
    name: 'Tradovate',
    avatar: '/avatars/tradovate.jpg',
    previousProfit: '+105.28%',
    totalProfit: '+105.28%',
    annualReturn: '+38426.11%',
    days: 30,
    status: 'available'
  },
  {
    id: '7',
    name: 'Interactive Brokers',
    avatar: '/avatars/interactive.jpg',
    previousProfit: '+10.25%',
    totalProfit: '+10.25%',
    annualReturn: '+3739.79%',
    days: 3,
    status: 'limited'
  },
  {
    id: '8',
    name: 'John Gerdes',
    avatar: '/avatars/john.jpg',
    previousProfit: '+23.09%',
    totalProfit: '+23.09%',
    annualReturn: '+8428.95%',
    days: 7,
    status: 'limited'
  },
  {
    id: '9',
    name: 'Oanda',
    avatar: '/avatars/oanda.jpg',
    previousProfit: '+55.22%',
    totalProfit: '+55.22%',
    annualReturn: '+20156.03%',
    days: 15,
    status: 'limited'
  }
];

const mockDeposits: Deposit[] = [
  {
    id: '1',
    amount: '1,250.00',
    date: '2024-01-15',
    status: 'completed',
    method: 'PIX',
    txId: 'PIX123456789'
  },
  {
    id: '2',
    amount: '500.00',
    date: '2024-01-10',
    status: 'completed',
    method: 'TED',
    txId: 'TED987654321'
  },
  {
    id: '3',
    amount: '800.00',
    date: '2024-01-08',
    status: 'processing',
    method: 'PIX'
  },
  {
    id: '4',
    amount: '2,000.00',
    date: '2024-01-05',
    status: 'completed',
    method: 'Transferência',
    txId: 'TRANS456789123'
  },
  {
    id: '5',
    amount: '300.00',
    date: '2024-01-02',
    status: 'pending',
    method: 'PIX'
  }
];

// Fixed status icon function
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-success" />;
    case 'processing':
      return <Clock className="w-4 h-4 text-warning" />;
    case 'pending':
      return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    default:
      return null;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Concluído';
    case 'processing':
      return 'Processando';
    case 'pending':
      return 'Pendente';
    default:
      return status;
  }
};

const InvestorsDashboard: React.FC = () => {
  const { toast } = useToast();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleSubscribe = (investorName: string) => {
    toast({
      title: "Subscrição realizada!",
      description: `Você agora está seguindo ${investorName}`,
    });
  };

  const handleCopyTxId = (txId: string) => {
    navigator.clipboard.writeText(txId);
    toast({
      title: "ID copiado!",
      description: "ID da transação copiado para a área de transferência",
    });
  };

  const totalDeposited = mockDeposits
    .filter(d => d.status === 'completed')
    .reduce((sum, d) => sum + parseFloat(d.amount.replace(',', '')), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">Mercados estratégicos</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Copy className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">5518991176034</span>
              <Button variant="ghost" size="sm">Copiar</Button>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">R$ {totalDeposited.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              <span className="text-xs text-muted-foreground">Saldo total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <Tabs defaultValue="investors" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="investors">Investidores</TabsTrigger>
            <TabsTrigger value="deposits">Meus Depósitos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="investors" className="mt-6">
            <div className="grid gap-4">
              {mockInvestors.map((investor) => (
                <Card key={investor.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={investor.avatar} />
                          <AvatarFallback>{investor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">{investor.name}</h3>
                          <div className="flex items-center space-x-6 mt-2">
                            <div className="text-center">
                              <div className="text-success font-medium">{investor.previousProfit}</div>
                              <div className="text-xs text-muted-foreground">Lucro anterior</div>
                            </div>
                            <div className="text-center">
                              <div className="text-success font-medium">{investor.totalProfit}</div>
                              <div className="text-xs text-muted-foreground">Lucro total</div>
                            </div>
                            <div className="text-center">
                              <div className="text-success font-medium">{investor.annualReturn}</div>
                              <div className="text-xs text-muted-foreground">Retorno anual</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="flex items-center space-x-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{investor.days} dias</span>
                          </div>
                          <div className="text-xs text-muted-foreground">Prazo</div>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          {investor.status === 'available' ? (
                            <Button 
                              onClick={() => handleSubscribe(investor.name)}
                              className="bg-success hover:bg-success-hover text-success-foreground px-8"
                            >
                              Subscrever
                            </Button>
                          ) : (
                            <Button 
                              variant="secondary" 
                              disabled
                              className="bg-muted text-muted-foreground px-8"
                            >
                              {investor.status === 'limited' ? 'Lv 2 disponível' : 'Lv 3 disponível'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="deposits" className="mt-6">
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-8 h-8 text-primary" />
                      <div>
                        <p className="text-2xl font-bold">R$ {totalDeposited.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        <p className="text-xs text-muted-foreground">Total Depositado</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-8 h-8 text-success" />
                      <div>
                        <p className="text-2xl font-bold">{mockDeposits.filter(d => d.status === 'completed').length}</p>
                        <p className="text-xs text-muted-foreground">Depósitos Concluídos</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-8 h-8 text-warning" />
                      <div>
                        <p className="text-2xl font-bold">{mockDeposits.filter(d => d.status !== 'completed').length}</p>
                        <p className="text-xs text-muted-foreground">Em Processamento</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Deposits List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Histórico de Depósitos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockDeposits.map((deposit) => (
                      <div key={deposit.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(deposit.status)}
                          <div>
                            <p className="font-medium">R$ {deposit.amount}</p>
                            <p className="text-sm text-muted-foreground">{deposit.method}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm font-medium">{getStatusText(deposit.status)}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(deposit.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        
                        {deposit.txId && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCopyTxId(deposit.txId!)}
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            ID
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InvestorsDashboard;