import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Copy, TrendingUp, Users, Award, Clock } from 'lucide-react';
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

const InvestorsDashboard: React.FC = () => {
  const { toast } = useToast();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleSubscribe = (investorName: string) => {
    toast({
      title: "Subscrição realizada!",
      description: `Você agora está seguindo ${investorName}`,
    });
  };

  const handleViewProfile = (investorName: string) => {
    toast({
      title: "Visualizando perfil",
      description: `Abrindo perfil de ${investorName}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">Mercados estratégicos</h1>
            <div className="text-muted-foreground">Meus depósitos</div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Copy className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">5518991176034</span>
              <Button variant="ghost" size="sm">Copiar</Button>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">0.0000</span>
              <span className="text-xs text-muted-foreground">Saldo total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid gap-4">
          {mockInvestors.map((investor) => (
            <Card key={investor.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={investor.avatar} />
                      <AvatarFallback>{investor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">{investor.name}</h3>
                      <div className="flex items-center space-x-4 mt-1">
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
                  
                  <div className="flex items-center space-x-4">
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
                          className="bg-success hover:bg-success-hover text-success-foreground"
                        >
                          Subscrever
                        </Button>
                      ) : (
                        <Button 
                          variant="secondary" 
                          disabled
                          className="bg-muted text-muted-foreground"
                        >
                          {investor.status === 'limited' ? 'Lv 2 disponível' : 'Lv 3 disponível'}
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewProfile(investor.name)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver perfil
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestorsDashboard;