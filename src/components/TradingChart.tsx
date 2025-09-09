import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ChartData {
  time: string;
  price: number;
  volume: number;
}

interface TradingChartProps {
  pair: string;
  currentPrice: number;
  change24h: number;
}

const TradingChart: React.FC<TradingChartProps> = ({ pair, currentPrice, change24h }) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [timeframe, setTimeframe] = useState('1H');
  const [isLive, setIsLive] = useState(true);

  // Generate initial chart data
  useEffect(() => {
    const generateInitialData = () => {
      const data: ChartData[] = [];
      let basePrice = currentPrice;
      const now = new Date();
      
      for (let i = 59; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60000); // 1 minute intervals
        const volatility = 0.02; // 2% volatility
        const priceChange = (Math.random() - 0.5) * volatility * basePrice;
        basePrice += priceChange;
        
        data.push({
          time: time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          price: parseFloat(basePrice.toFixed(2)),
          volume: Math.random() * 1000000
        });
      }
      return data;
    };

    setChartData(generateInitialData());
  }, [currentPrice]);

  // Update chart data periodically
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setChartData(prevData => {
        const newData = [...prevData];
        const lastPrice = newData[newData.length - 1]?.price || currentPrice;
        const volatility = 0.01; // 1% volatility for updates
        const priceChange = (Math.random() - 0.5) * volatility * lastPrice;
        const newPrice = lastPrice + priceChange;
        
        const now = new Date();
        const newPoint = {
          time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          price: parseFloat(newPrice.toFixed(2)),
          volume: Math.random() * 1000000
        };

        // Keep only last 60 points
        if (newData.length >= 60) {
          newData.shift();
        }
        newData.push(newPoint);

        return newData;
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [isLive, currentPrice]);

  const latestPrice = chartData[chartData.length - 1]?.price || currentPrice;
  const priceDirection = chartData.length > 1 && latestPrice > chartData[chartData.length - 2]?.price;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{pair}</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant={isLive ? "default" : "outline"}
              size="sm"
              onClick={() => setIsLive(!isLive)}
              className="text-xs"
            >
              {isLive ? "LIVE" : "PAUSED"}
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-foreground">
              ${latestPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            {priceDirection ? (
              <TrendingUp className="w-5 h-5 text-success" />
            ) : (
              <TrendingDown className="w-5 h-5 text-destructive" />
            )}
          </div>
          <div className={`text-sm font-medium ${change24h >= 0 ? 'text-success' : 'text-destructive'}`}>
            {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}% (24h)
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex space-x-2">
            {['1M', '5M', '15M', '1H', '4H', '1D'].map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe(tf)}
                className="text-xs"
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                domain={['dataMin - 100', 'dataMax + 100']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
                labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#priceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Volume 24h:</span>
            <div className="font-medium">
              ${(chartData[chartData.length - 1]?.volume || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Última atualização:</span>
            <div className="font-medium">
              {chartData[chartData.length - 1]?.time || '--:--'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingChart;
