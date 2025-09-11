import { useState, useEffect } from 'react';
import binanceService from '@/services/binanceService';

interface UseBinancePricesReturn {
  prices: Array<{
    symbol: string;
    price: string;
    time: number;
  }>;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseBinanceTickerReturn {
  ticker: any;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseBinanceKlinesReturn {
  klines: Array<{
    openTime: number;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
    closeTime: number;
    quoteAssetVolume: string;
    numberOfTrades: number;
    takerBuyBaseAssetVolume: string;
    takerBuyQuoteAssetVolume: string;
    ignore: string;
  }>;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Hook para preços em tempo real
export const useBinancePrices = (symbols: string[] = [], refreshInterval = 5000): UseBinancePricesReturn => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await binanceService.getPrices(symbols);
      setPrices(data);
    } catch (err) {
      setError('Erro ao buscar preços');
      console.error('Error fetching prices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();

    if (refreshInterval > 0) {
      const interval = setInterval(fetchPrices, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [symbols.join(','), refreshInterval]);

  return { prices, loading, error, refetch: fetchPrices };
};

// Hook para estatísticas 24h
export const useBinanceTicker = (symbol: string, refreshInterval = 10000): UseBinanceTickerReturn => {
  const [ticker, setTicker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTicker = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await binanceService.get24hrStats(symbol);
      setTicker(data);
    } catch (err) {
      setError('Erro ao buscar estatísticas');
      console.error('Error fetching ticker:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (symbol) {
      fetchTicker();

      if (refreshInterval > 0) {
        const interval = setInterval(fetchTicker, refreshInterval);
        return () => clearInterval(interval);
      }
    }
  }, [symbol, refreshInterval]);

  return { ticker, loading, error, refetch: fetchTicker };
};

// Hook para dados de candlestick
export const useBinanceKlines = (
  symbol: string,
  interval: string = '1m',
  limit: number = 100,
  refreshInterval = 60000
): UseBinanceKlinesReturn => {
  const [klines, setKlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKlines = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await binanceService.getKlines(symbol, interval, limit);
      setKlines(data);
    } catch (err) {
      setError('Erro ao buscar dados de candlestick');
      console.error('Error fetching klines:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (symbol) {
      fetchKlines();

      if (refreshInterval > 0) {
        const intervalId = setInterval(fetchKlines, refreshInterval);
        return () => clearInterval(intervalId);
      }
    }
  }, [symbol, interval, limit, refreshInterval]);

  return { klines, loading, error, refetch: fetchKlines };
};

// Hook para informações da conta
export const useBinanceAccount = () => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccount = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await binanceService.getAccountInfo();
      setAccount(data);
    } catch (err) {
      setError('Erro ao buscar informações da conta');
      console.error('Error fetching account:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  return { account, loading, error, refetch: fetchAccount };
};

// Hook para histórico de depósitos
export const useBinanceDeposits = (asset: string = 'USDT', limit: number = 10) => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await binanceService.getDepositHistory(asset, limit);
      setDeposits(data || []);
    } catch (err) {
      setError('Erro ao buscar histórico de depósitos');
      console.error('Error fetching deposits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, [asset, limit]);

  return { deposits, loading, error, refetch: fetchDeposits };
};

// Hook para endereço de depósito
export const useBinanceDepositAddress = (asset: string = 'USDT') => {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddress = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await binanceService.getDepositAddress(asset);
      if (data && data.address) {
        setAddress(data.address);
      } else {
        // Fallback para endereço hardcoded se API falhar
        setAddress(binanceService.getUSDTDepositAddress());
      }
    } catch (err) {
      setError('Erro ao buscar endereço de depósito');
      console.error('Error fetching deposit address:', err);
      // Fallback
      setAddress(binanceService.getUSDTDepositAddress());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, [asset]);

  return { address, loading, error, refetch: fetchAddress };
};
