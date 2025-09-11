import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, EyeOff, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '../services/apiService';
import { qrCodeService } from '../services/qrCodeService';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'reward';
  amount: string;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface DepositInfo {
  address: string;
  qrCodeUrl: string;
}

interface BackendTransaction {
  id: number;
  type: string;
  amount: string;
  currency: string;
  created_at: string;
  status: string;
}

const Wallet: React.FC = () => {
  const { toast } = useToast();
  const [showBalance, setShowBalance] = useState(false);
  const [balance, setBalance] = useState('0.0000');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [depositInfo, setDepositInfo] = useState<DepositInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar dados do backend
  useEffect(() => {
    const loadWalletData = async () => {
      try {
        setLoading(true);

        // Carregar saldo
        const balanceData = await apiService.getBalance();
        setBalance(balanceData.balance_usdt?.toFixed(4) || '0.0000');

        // Carregar transações
        const transactionsData: BackendTransaction[] = await apiService.getWalletHistory(10);
        const formattedTransactions = transactionsData.map((tx: BackendTransaction) => ({
          id: tx.id.toString(),
          type: tx.type as 'deposit' | 'withdrawal' | 'reward',
          amount: tx.amount.toString(),
          currency: tx.currency,
          date: new Date(tx.created_at).toLocaleDateString('pt-BR'),
          status: tx.status as 'completed' | 'pending' | 'failed'
        }));
        setTransactions(formattedTransactions);

      } catch (error) {
        console.error('Erro ao carregar dados da carteira:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados da carteira.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadWalletData();
  }, []);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText('5518991176034');
    toast({
      title: "Endereço copiado!",
      description: "Endereço da carteira copiado para a área de transferência",
    });
  };

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawCurrency, setWithdrawCurrency] = useState('USDT');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const handleWithdraw = () => {
    setShowWithdrawModal(true);
  };

  const handleConfirmWithdraw = async () => {
    try {
      // Validar entrada
      const amount = parseFloat(withdrawAmount);
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Valor inválido",
          description: "Por favor, insira um valor válido para retirada.",
          variant: "destructive",
        });
        return;
      }

      // Chamar a API real para processar a retirada
      await apiService.createWithdrawal({
        amount,
        currency: withdrawCurrency,
        address: withdrawAddress
      });

      toast({
        title: "Retirada solicitada",
        description: `Retirada de ${withdrawAmount} ${withdrawCurrency} para o endereço ${withdrawAddress} solicitada com sucesso.`,
      });
      setShowWithdrawModal(false);
      setWithdrawAddress('');
      setWithdrawAmount('');
      setWithdrawCurrency('USDT');
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro na Retirada",
        description: "Não foi possível processar a retirada. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const WithdrawModal = () => {
    if (!showWithdrawModal) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-gray-900 text-white rounded-lg p-6 w-96 shadow-lg">
          <h2 className="text-lg font-bold mb-4">Retirada</h2>
          <label className="block mb-2">
            Endereço da criptomoeda:
            <input
              type="text"
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
              className="w-full border border-gray-600 bg-gray-800 text-white rounded px-2 py-1 mt-1"
            />
          </label>
          <label className="block mb-2">
            Moeda:
            <select
              value={withdrawCurrency}
              onChange={(e) => setWithdrawCurrency(e.target.value)}
              className="w-full border border-gray-600 bg-gray-800 text-white rounded px-2 py-1 mt-1"
            >
              <option value="USDT">USDT</option>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
              {/* Adicione outras moedas conforme necessário */}
            </select>
          </label>
          <label className="block mb-4">
            Quantidade:
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="w-full border border-gray-600 bg-gray-800 text-white rounded px-2 py-1 mt-1"
            />
          </label>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowWithdrawModal(false)}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmWithdraw}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleDeposit = async () => {
    toast({
      title: "Gerando endereço de depósito...",
      description: "Aguarde enquanto preparamos seu endereço e QR Code.",
    });

    try {
      // Usar rota pública para teste (sem autenticação)
      const response = await fetch('http://localhost:5000/api/binance-public/deposit-address-public');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro na API');
      }

      // Gera o QR Code usando o serviço
      const qrCodeResult = await qrCodeService.generateUSDTQRCode(data.address, undefined, 'TRC20');

      setDepositInfo({
        address: data.address,
        qrCodeUrl: qrCodeResult.dataURL
      });

      toast({
        title: "Sucesso!",
        description: "Seu endereço de depósito foi gerado.",
      });

    } catch (error) {
      console.error(error);
      toast({
        title: "Erro no Depósito",
        description: "Não foi possível gerar o endereço. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleCoupons = () => {
    toast({
      title: "Meus cupons",
      description: "Visualizando cupons disponíveis",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header com Endereço */}
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

      {/* Modal de Retirada */}
      <WithdrawModal />

      {/* Cartão de Saldo */}
      <div className="p-6">
        <Card className="bg-gradient-to-br from-surface to-surface-elevated border-0 mb-6">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Ativos totais (USDT)</div>
                <div className="text-4xl font-bold text-foreground flex items-center space-x-2">
                  <span>{showBalance ? balance : '****'}</span>
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

        {/* Informações de Depósito (Modal ou Card) */}
        {depositInfo && (
          <Card className="bg-card border-2 border-primary mt-6">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-bold mb-4">Deposite para sua carteira</h3>
              <p className="text-sm text-muted-foreground mb-2">Envie USDT para o endereço abaixo, na rede **{depositInfo.address.startsWith('T') ? 'TRC20' : 'Desconhecida'}**.</p>
              <img src={depositInfo.qrCodeUrl} alt="QR Code de Depósito" className="mx-auto my-4 w-40 h-40" />
              <div className="bg-secondary p-4 rounded-md flex items-center justify-between">
                <span className="text-sm font-mono break-all">{depositInfo.address}</span>
                <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(depositInfo.address)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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

        {/* Seção de Transações */}
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
