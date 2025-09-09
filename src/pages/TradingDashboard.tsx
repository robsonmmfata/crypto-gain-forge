import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Bitcoin, Zap } from 'lucide-react';
import TradingChart from '@/components/TradingChart';

interface CryptoPair {
  symbol: string;
  name: string;
  price: string;
  change24h: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

const cryptoPairs: CryptoPair[] = [
  {
    symbol: 'BTC/USDT',
    name: 'Bitcoin',
    price: '112360.00000',
    change24h: '0.00%',
    isPositive: false,
    icon: <Bitcoin className="w-6 h-6 text-orange-500" />
  },
  {
    symbol: 'ETH/USDT',
    name: 'Ethereum',
    price: '112397.51000',
    change24h: '+0.03%',
    isPositive: true,
    icon: <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">Ξ</div>
  },
  {
    symbol: 'ETH/USDC',
    name: 'Ethereum/USDC',
    price: '3847.25',
    change24h: '+0.15%',
    isPositive: true,
    icon: <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">Ξ</div>
  },
  {
    symbol: 'BTC/USDC',
    name: 'Bitcoin/USDC',
    price: '112396.78',
    change24h: '-0.01%',
    isPositive: false,
    icon: <Bitcoin className="w-6 h-6 text-orange-500" />
  },
  {
    symbol: 'XRP/USDT',
    name: 'Ripple',
    price: '2.3456',
    change24h: '+5.23%',
    isPositive: true,
    icon: <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold">XRP</div>
  },
  {
    symbol: 'BNB/USDT',
    name: 'Binance Coin',
    price: '712.45',
    change24h: '+2.15%',
    isPositive: true,
    icon: <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">BNB</div>
  },
  {
    symbol: 'SOL/USDT',
    name: 'Solana',
    price: '245.67',
    change24h: '+3.45%',
    isPositive: true,
    icon: <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">SOL</div>
  }
];

const TradingDashboard: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState('BTC/USDT');
  const [timeframe, setTimeframe] = useState('1Min');
  const [showPairSelector, setShowPairSelector] = useState(false);

  const currentPair = cryptoPairs.find(pair => pair.symbol === selectedPair) || cryptoPairs[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground">0.0000 USDT</span>
            <div className="flex items-center space-x-2">
              {currentPair.icon}
              <button 
                onClick={() => setShowPairSelector(!showPairSelector)}
                className="flex items-center space-x-2 text-foreground hover:text-primary"
              >
                <span className="font-semibold">{selectedPair}</span>
                <ArrowDownRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">24H Volume</div>
              <div className="font-medium">112364.45000</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">24H Vol (USDT)</div>
              <div className="font-medium">112360.00000</div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <div>2:15.8M</div>
              <div>409.4M</div>
            </div>
            <Button variant="default" size="sm">
              Depósito
            </Button>
          </div>
        </div>
      </div>

      {/* Pair Selector Dropdown */}
      {showPairSelector && (
        <div className="absolute left-4 top-20 z-50 bg-card border border-border rounded-lg shadow-lg min-w-[300px]">
          <div className="p-4 space-y-2">
            {cryptoPairs.map((pair) => (
              <div
                key={pair.symbol}
                onClick={() => {
                  setSelectedPair(pair.symbol);
                  setShowPairSelector(false);
                }}
                className="flex items-center justify-between p-2 hover:bg-surface rounded cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  {pair.icon}
                  <div>
                    <div className="font-medium">{pair.symbol}</div>
                    <div className="text-sm text-muted-foreground">{pair.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{pair.price}</div>
                  <div className={`text-sm ${pair.isPositive ? 'text-success' : 'text-destructive'}`}>
                    {pair.change24h}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex">
        {/* Chart Area */}
        <div className="flex-1 p-4">
          <div className="mb-4">
            <div className="flex items-center space-x-4 mb-2">
              <div className="text-2xl font-bold">{currentPair.price}</div>
              <div className={`flex items-center space-x-1 ${currentPair.isPositive ? 'text-success' : 'text-destructive'}`}>
                {currentPair.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{currentPair.change24h}</span>
                <Badge variant={currentPair.isPositive ? "default" : "destructive"}>
                  Regular
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
              <span>24H High: 113100.00</span>
              <span>24H Low: 112200.00</span>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              {['1Min', '5Min', '15Min', '30Min'].map((tf) => (
                <Button
                  key={tf}
                  variant={timeframe === tf ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeframe(tf)}
                  className="text-xs"
                >
                  {tf}
                </Button>
              ))}
            </div>
          </div>

          {/* Trading Chart */}
          <TradingChart 
            pair={selectedPair}
            currentPrice={parseFloat(currentPair.price.replace(',', ''))}
            change24h={parseFloat(currentPair.change24h.replace(/[%+]/g, ''))}
          />
        </div>

        {/* Right Panel - Trading Actions */}
        <div className="w-80 p-4 border-l border-border">
          <div className="space-y-4">
            {/* Trading Indicators */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">24H Volume</span>
                  <span className="font-medium">112364.45000</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">24H Vol (USDT)</span>
                  <span className="font-medium">112360.00000</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center p-2 bg-surface rounded">
                    <div className="text-muted-foreground">MA</div>
                    <div className="font-medium">RSI</div>
                  </div>
                  <div className="text-center p-2 bg-surface rounded">
                    <div className="text-muted-foreground">BOLL</div>
                    <div className="font-medium">MACD</div>
                  </div>
                  <div className="text-center p-2 bg-surface rounded">
                    <div className="text-muted-foreground">KDJ</div>
                    <div className="font-medium">RSI</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Trading Panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex">
          <Button className="flex-1 h-16 bg-success hover:bg-success-hover text-success-foreground rounded-none">
            <div className="flex items-center space-x-2">
              <ArrowUpRight className="w-5 h-5" />
              <div>
                <div className="font-medium">BUY</div>
                <div className="text-xs">{currentPair.price}</div>
              </div>
            </div>
          </Button>
          <Button className="flex-1 h-16 bg-destructive hover:bg-destructive-hover text-destructive-foreground rounded-none">
            <div className="flex items-center space-x-2">
              <ArrowDownRight className="w-5 h-5" />
              <div>
                <div className="font-medium">SELL</div>
                <div className="text-xs">{currentPair.price}</div>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TradingDashboard;