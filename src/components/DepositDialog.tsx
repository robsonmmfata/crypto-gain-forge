import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, QrCode, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { qrCodeService } from '@/services/qrCodeService';
import { binanceService } from '@/services/binanceService';

interface DepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investorName?: string;
}

const PRESET_AMOUNTS = [5, 10, 15, 20, 25, 30];

const DepositDialog: React.FC<DepositDialogProps> = ({ open, onOpenChange, investorName }) => {
  const [amount, setAmount] = useState<number>(5);
  const [customAmount, setCustomAmount] = useState('');
  const [qrCode, setQrCode] = useState<string>('');
  const [depositAddress, setDepositAddress] = useState<string>('');
  const [usdtPrice, setUsdtPrice] = useState<number>(1);
  const { toast } = useToast();

  // USDT deposit address (you should replace this with your actual address)
  const USDT_ADDRESS = 'TLbVGmYfgYLRk72KwxZALL6Scj9ona1Z5j';

  useEffect(() => {
    const fetchUSDTPrice = async () => {
      try {
        const prices = await binanceService.getPrices(['USDTBRL']);
        if (prices.length > 0) {
          setUsdtPrice(parseFloat(prices[0].price));
        }
      } catch (error) {
        console.error('Error fetching USDT price:', error);
        // Fallback price if API fails
        setUsdtPrice(5.5);
      }
    };

    if (open) {
      fetchUSDTPrice();
      setDepositAddress(USDT_ADDRESS);
    }
  }, [open]);

  useEffect(() => {
    const generateQR = async () => {
      if (depositAddress && amount > 0) {
        try {
          const usdtAmount = (amount / usdtPrice).toFixed(6);
          const qrResult = await qrCodeService.generateUSDTQRCode(
            depositAddress,
            usdtAmount,
            'BSC'
          );
          setQrCode(qrResult.dataURL);
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      }
    };

    generateQR();
  }, [depositAddress, amount, usdtPrice]);

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setAmount(numValue);
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(depositAddress);
    toast({
      title: "Endereço copiado!",
      description: "Endereço USDT copiado para a área de transferência",
    });
  };

  const handleCopyAmount = () => {
    const usdtAmount = (amount / usdtPrice).toFixed(6);
    navigator.clipboard.writeText(usdtAmount);
    toast({
      title: "Quantidade copiada!",
      description: `${usdtAmount} USDT copiado para a área de transferência`,
    });
  };

  const usdtAmount = (amount / usdtPrice).toFixed(6);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Fazer Depósito
          </DialogTitle>
          <DialogDescription>
            {investorName ? `Depositar para seguir ${investorName}` : 'Escolha o valor do seu depósito em USDT'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Preset Amounts */}
          <div>
            <Label className="text-base font-medium">Valores Rápidos (USD)</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {PRESET_AMOUNTS.map((presetAmount) => (
                <Button
                  key={presetAmount}
                  variant={amount === presetAmount ? "default" : "outline"}
                  onClick={() => handleAmountSelect(presetAmount)}
                  className="h-12 text-lg font-medium"
                >
                  ${presetAmount}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <Label htmlFor="customAmount">Valor Personalizado (USD)</Label>
            <Input
              id="customAmount"
              type="number"
              placeholder="Digite o valor"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              className="mt-1"
              min="1"
              step="0.01"
            />
          </div>

          {/* Amount Summary */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Valor em USD</p>
                  <p className="text-2xl font-bold text-primary">${amount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Quantidade USDT</p>
                  <p className="text-2xl font-bold text-accent">{usdtAmount}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  Taxa atual: 1 USDT = ${usdtPrice.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Deposit Instructions */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Endereço de Depósito USDT (BSC)</h4>
                  <Badge variant="secondary">BEP20</Badge>
                </div>
                
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <code className="text-sm break-all">{depositAddress}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyAddress}
                      className="ml-2 flex-shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Quantidade a Enviar:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyAmount}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      {usdtAmount} USDT
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          {qrCode && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <QrCode className="w-5 h-5" />
                    <h4 className="font-semibold">QR Code para Depósito</h4>
                  </div>
                  <div className="flex justify-center">
                    <img 
                      src={qrCode} 
                      alt="QR Code para depósito USDT" 
                      className="w-48 h-48 border border-border rounded-lg"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Escaneie com sua carteira para fazer o depósito automaticamente
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Important Notice */}
          <Card className="border-warning/50 bg-warning/5">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-warning mb-2">⚠️ Importante</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Envie apenas USDT na rede BSC (BEP20)</li>
                <li>• O depósito será processado automaticamente após confirmação na blockchain</li>
                <li>• Tempo de processamento: 3-10 minutos</li>
                <li>• Mantenha o comprovante da transação</li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                toast({
                  title: "Instruções de depósito enviadas!",
                  description: "Siga as instruções acima para completar seu depósito.",
                });
                onOpenChange(false);
              }}
              className="flex-1"
            >
              Entendi
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DepositDialog;