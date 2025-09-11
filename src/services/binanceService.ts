import axios from 'axios';
import CryptoJS from 'crypto-js';

// Binance API Configuration
const BINANCE_API_URL = 'https://api.binance.com';
const BINANCE_TESTNET_URL = 'https://testnet.binance.vision';

// Use testnet for development, mainnet for production
const API_BASE_URL = process.env.NODE_ENV === 'production' ? BINANCE_API_URL : BINANCE_TESTNET_URL;

// Your Binance API credentials (store in environment variables)
const API_KEY = process.env.REACT_APP_BINANCE_API_KEY || 'XOcWbSpqPMnRL0NdE13zYolg0gVlw05NflU5EEWOTwGf7QafYG9LQ46xlPQznGuY';
const SECRET_KEY = process.env.REACT_APP_BINANCE_SECRET_KEY || 't6fnDIRKoPUuuO4wXA4rMspvhhXD3qZ8Eg4BSLaZUs20wcohKdbjoonvdmSvMFV5';

// USDT Deposit Address (your Binance USDT address)
const USDT_DEPOSIT_ADDRESS = process.env.REACT_APP_BINANCE_USDT_ADDRESS || 'TLbVGmYfgYLRk72KwxZALL6Scj9ona1Z5j';

interface BinancePrice {
  symbol: string;
  price: string;
  time: number;
}

interface BinanceTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

interface BinanceKline {
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
}

class BinanceService {
  private generateSignature(queryString: string): string {
    return CryptoJS.HmacSHA256(queryString, SECRET_KEY).toString();
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}, requiresAuth = false): Promise<any> {
    try {
      let url = `${API_BASE_URL}${endpoint}`;

      if (requiresAuth) {
        const timestamp = Date.now();
        const queryString = new URLSearchParams({
          ...params,
          timestamp: timestamp.toString(),
          recvWindow: '5000'
        }).toString();

        const signature = this.generateSignature(queryString);

        url += `?${queryString}&signature=${signature}`;

        const response = await axios.get(url, {
          headers: {
            'X-MBX-APIKEY': API_KEY,
            'Content-Type': 'application/json'
          }
        });

        return response.data;
      } else {
        const queryString = new URLSearchParams(params).toString();
        if (queryString) {
          url += `?${queryString}`;
        }

        const response = await axios.get(url);
        return response.data;
      }
    } catch (error) {
      console.error('Binance API Error:', error);
      throw error;
    }
  }

  // Get current prices for multiple symbols
  async getPrices(symbols: string[] = []): Promise<BinancePrice[]> {
    try {
      const params: Record<string, any> = {};
      if (symbols.length > 0) {
        params.symbols = JSON.stringify(symbols.map(s => s.toUpperCase()));
      }

      const data = await this.makeRequest('/api/v3/ticker/price', params);

      if (Array.isArray(data)) {
        return data.map((item: any) => ({
          symbol: item.symbol,
          price: item.price,
          time: Date.now()
        }));
      } else {
        return [{
          symbol: data.symbol,
          price: data.price,
          time: Date.now()
        }];
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
      return [];
    }
  }

  // Get 24hr ticker statistics
  async get24hrStats(symbol: string): Promise<BinanceTicker | null> {
    try {
      const data = await this.makeRequest('/api/v3/ticker/24hr', { symbol: symbol.toUpperCase() });
      return data;
    } catch (error) {
      console.error('Error fetching 24hr stats:', error);
      return null;
    }
  }

  // Get klines (candlestick data)
  async getKlines(symbol: string, interval: string = '1m', limit: number = 100): Promise<BinanceKline[]> {
    try {
      const data = await this.makeRequest('/api/v3/klines', {
        symbol: symbol.toUpperCase(),
        interval,
        limit
      });

      return data.map((kline: any[]) => ({
        openTime: kline[0],
        open: kline[1],
        high: kline[2],
        low: kline[3],
        close: kline[4],
        volume: kline[5],
        closeTime: kline[6],
        quoteAssetVolume: kline[7],
        numberOfTrades: kline[8],
        takerBuyBaseAssetVolume: kline[9],
        takerBuyQuoteAssetVolume: kline[10],
        ignore: kline[11]
      }));
    } catch (error) {
      console.error('Error fetching klines:', error);
      return [];
    }
  }

  // Get account information (requires authentication)
  async getAccountInfo(): Promise<any> {
    try {
      return await this.makeRequest('/api/v3/account', {}, true);
    } catch (error) {
      console.error('Error fetching account info:', error);
      return null;
    }
  }

  // Get deposit address for USDT
  async getDepositAddress(asset: string = 'USDT'): Promise<any> {
    try {
      return await this.makeRequest('/sapi/v1/capital/deposit/address', { coin: asset }, true);
    } catch (error) {
      console.error('Error fetching deposit address:', error);
      return null;
    }
  }

  // Get deposit history
  async getDepositHistory(asset: string = 'USDT', limit: number = 10): Promise<any> {
    try {
      return await this.makeRequest('/sapi/v1/capital/deposit/hisrec', {
        coin: asset,
        limit
      }, true);
    } catch (error) {
      console.error('Error fetching deposit history:', error);
      return null;
    }
  }

  // Get withdrawal history
  async getWithdrawalHistory(asset: string = 'USDT', limit: number = 10): Promise<any> {
    try {
      return await this.makeRequest('/sapi/v1/capital/withdraw/history', {
        coin: asset,
        limit
      }, true);
    } catch (error) {
      console.error('Error fetching withdrawal history:', error);
      return null;
    }
  }

  // Get USDT deposit address (cached for performance)
  getUSDTDepositAddress(): string {
    return USDT_DEPOSIT_ADDRESS;
  }

  // Format price for display
  formatPrice(price: string | number, decimals: number = 2): string {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toFixed(decimals);
  }

  // Calculate price change percentage
  calculatePriceChange(currentPrice: string, previousPrice: string): number {
    const current = parseFloat(currentPrice);
    const previous = parseFloat(previousPrice);
    return ((current - previous) / previous) * 100;
  }
}

export const binanceService = new BinanceService();
export default binanceService;
