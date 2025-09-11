import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor() {
    // Interceptor para adicionar token JWT automaticamente
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('cryptovault_token') || localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor para tratar erros de resposta
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('cryptovault_token');
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    if (token) {
      localStorage.setItem('cryptovault_token', token);
    } else {
      localStorage.removeItem('cryptovault_token');
    }
  }

  // ========== AUTENTICAÇÃO ==========
  async register(userData: {
    username: string;
    email: string;
    password: string;
    full_name?: string;
  }) {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  }

  async getProfile() {
    const response = await this.api.get('/auth/profile');
    return response.data;
  }

  async updateProfile(userData: Record<string, unknown>) {
    const response = await this.api.put('/auth/profile', userData);
    return response.data;
  }

  logout() {
    localStorage.removeItem('token');
  }

  // ========== CARTEIRA ==========
  async getBalance() {
    const response = await this.api.get('/wallet/balance');
    return response.data;
  }

  async getWalletInfo() {
    const response = await this.api.get('/wallet/info');
    return response.data;
  }

  async getWalletStats() {
    const response = await this.api.get('/wallet/stats');
    return response.data;
  }

  async getWalletHistory(limit = 20) {
    const response = await this.api.get(`/wallet/history?limit=${limit}`);
    return response.data;
  }

  async createDeposit(depositData: {
    amount: number;
    currency: string;
    description?: string;
  }) {
    const response = await this.api.post('/wallet/deposit', depositData);
    return response.data;
  }

  async createWithdrawal(withdrawalData: {
    amount: number;
    currency: string;
    address: string;
    description?: string;
  }) {
    const response = await this.api.post('/wallet/withdraw', withdrawalData);
    return response.data;
  }

  // ========== INVESTIMENTOS ==========
  async getInvestmentPlans() {
    const response = await this.api.get('/investment/plans');
    return response.data;
  }

  async getUserInvestments() {
    const response = await this.api.get('/investment/user');
    return response.data;
  }

  async createInvestment(investmentData: {
    plan_id: number;
    amount: number;
  }) {
    const response = await this.api.post('/investment/create', investmentData);
    return response.data;
  }

  async getInvestmentDetails(investmentId: number) {
    const response = await this.api.get(`/investment/${investmentId}`);
    return response.data;
  }

  // ========== TRANSAÇÕES ==========
  async getTransactionHistory(limit = 50) {
    const response = await this.api.get(`/transaction/history?limit=${limit}`);
    return response.data;
  }

  async getTransactionDetails(transactionId: number) {
    const response = await this.api.get(`/transaction/${transactionId}`);
    return response.data;
  }

  // ========== CONFIGURAÇÕES ==========
  async getSettings() {
    const response = await this.api.get('/settings');
    return response.data;
  }

  async updateSettings(settings: Record<string, unknown>) {
    const response = await this.api.put('/settings', settings);
    return response.data;
  }

  // ========== BINANCE (PÚBLICO) ==========
  async getBinancePrices() {
    const response = await this.api.get('/binance/prices');
    return response.data;
  }

  async getBinanceTicker(symbol: string) {
    const response = await this.api.get(`/binance/ticker/${symbol}`);
    return response.data;
  }

  async getBinanceKlines(symbol: string, interval: string, limit = 100) {
    const response = await this.api.get(`/binance/klines/${symbol}?interval=${interval}&limit=${limit}`);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
