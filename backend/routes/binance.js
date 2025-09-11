const express = require('express');
const axios = require('axios');
const crypto = require('crypto-js');
const { authenticateToken } = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();

const BINANCE_API_URL = process.env.NODE_ENV === 'production' ? 'https://api.binance.com' : 'https://testnet.binance.vision';
const API_KEY = process.env.BINANCE_API_KEY;
const SECRET_KEY = process.env.BINANCE_SECRET_KEY;

// Função para gerar assinatura HMAC SHA256
function generateSignature(queryString) {
  return crypto.HmacSHA256(queryString, SECRET_KEY).toString();
}

// Middleware para autenticação
router.use(authenticateToken);

// Função para fazer requisição autenticada GET
async function makeRequest(endpoint, params = {}) {
  const timestamp = Date.now();
  const query = new URLSearchParams({ ...params, timestamp, recvWindow: '5000' }).toString();
  const signature = generateSignature(query);
  const url = `${BINANCE_API_URL}${endpoint}?${query}&signature=${signature}`;

  try {
    const response = await axios.get(url, {
      headers: { 'X-MBX-APIKEY': API_KEY }
    });
    return response.data;
  } catch (error) {
    console.error('Erro na Binance API:', error.response?.data || error.message);
    throw error;
  }
}

// Endpoint para obter endereço de depósito USDT
router.get('/deposit-address', async (req, res) => {
  try {
    // Retornar endereço fixo conforme solicitado
    const data = {
      coin: 'USDT',
      address: 'TLbVGmYfgYLRk72KwxZALL6Scj9ona1Z5j',
      tag: '',
      url: 'https://tronscan.org/#/address/TLbVGmYfgYLRk72KwxZALL6Scj9ona1Z5j'
    };
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter endereço de depósito' });
  }
});

// Endpoint para obter histórico de depósitos
router.get('/deposit-history', async (req, res) => {
  try {
    const data = await makeRequest('/sapi/v1/capital/deposit/hisrec', { coin: 'USDT', limit: 10 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter histórico de depósitos' });
  }
});

// Endpoint para obter histórico de retiradas
router.get('/withdrawal-history', async (req, res) => {
  try {
    const data = await makeRequest('/sapi/v1/capital/withdraw/history', { coin: 'USDT', limit: 10 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter histórico de retiradas' });
  }
});

module.exports = router;
