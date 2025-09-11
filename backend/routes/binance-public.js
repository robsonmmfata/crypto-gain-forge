const express = require('express');
const router = express.Router();

// Endpoint público para obter endereço de depósito USDT (sem autenticação para teste)
router.get('/deposit-address-public', async (req, res) => {
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

module.exports = router;
