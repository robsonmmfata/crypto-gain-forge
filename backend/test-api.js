const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Testando API do CryptoGain...\n');

  try {
    // Teste 1: Registrar usuário
    console.log('1. Testando registro de usuário...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      full_name: 'Test User'
    });
    console.log('✅ Registro:', registerResponse.data);

    // Teste 2: Login
    console.log('\n2. Testando login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ Login:', loginResponse.data);
    const token = loginResponse.data.token;

    // Teste 3: Obter perfil
    console.log('\n3. Testando obtenção de perfil...');
    const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Perfil:', profileResponse.data);

    // Teste 4: Obter saldo da carteira
    console.log('\n4. Testando saldo da carteira...');
    const walletResponse = await axios.get(`${BASE_URL}/wallet/balance`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Saldo:', walletResponse.data);

    // Teste 5: Obter planos de investimento
    console.log('\n5. Testando planos de investimento...');
    const plansResponse = await axios.get(`${BASE_URL}/investment/plans`);
    console.log('✅ Planos:', plansResponse.data);

    // Teste 6: Obter histórico de transações
    console.log('\n6. Testando histórico de transações...');
    const transactionsResponse = await axios.get(`${BASE_URL}/transaction/history`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Transações:', transactionsResponse.data);

    console.log('\n🎉 Todos os testes passaram!');

  } catch (error) {
    console.error('❌ Erro no teste:', error.response ? error.response.data : error.message);
  }
}

// Executar testes
testAPI();
