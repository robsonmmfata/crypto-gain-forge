# 🚀 Guia Rápido - Setup Backend CryptoGain

## Pré-requisitos

1. **Node.js** (versão 16 ou superior)
2. **PostgreSQL** instalado e rodando
3. **Conta na Binance** com API habilitada

## 📋 Passos para Configuração

### 1. Instalar Dependências
```bash
cd backend
npm install
```

### 2. Configurar Banco PostgreSQL
```bash
# Criar banco de dados
createdb cryptogain_db

# Ou via SQL:
# CREATE DATABASE cryptogain_db;
```

### 3. Configurar Variáveis de Ambiente
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env com suas configurações
nano .env
```

**Conteúdo mínimo do .env:**
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/cryptogain_db
JWT_SECRET=sua_chave_jwt_secreta_aqui
BINANCE_API_KEY=sua_api_key_binance
BINANCE_SECRET_KEY=sua_secret_key_binance
BINANCE_USDT_ADDRESS=seu_endereco_usdt
```

### 4. Inicializar Banco de Dados
```bash
npm run init-db
```

### 5. Iniciar Servidor
```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm start
```

### 6. Testar API
```bash
npm run test
```

## 🔧 Configuração da Binance API

1. Acesse [Binance API Management](https://www.binance.com/en/my/settings/api-management)
2. Crie uma nova API Key
3. Habilite as seguintes permissões:
   - ✅ Read Info
   - ✅ Enable Spot & Margin Trading
   - ✅ Enable Futures
   - ✅ Enable Reading
4. Configure restrições de IP (recomendado)
5. Copie as chaves para o `.env`

## 📊 Endpoints Disponíveis

Após iniciar o servidor, a API estará disponível em `http://localhost:5000/api`

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/profile` - Obter perfil

### Carteira
- `GET /api/wallet` - Informações da carteira
- `GET /api/wallet/deposit-address/:currency` - Endereço de depósito

### Investimentos
- `GET /api/investments/plans` - Planos disponíveis
- `POST /api/investments` - Criar investimento
- `GET /api/investments` - Seus investimentos

### Transações
- `GET /api/transactions` - Histórico
- `POST /api/transactions/deposit` - Depósito
- `POST /api/transactions/withdrawal` - Retirada

### Dashboard
- `GET /api/dashboard/stats` - Estatísticas
- `GET /api/dashboard/earnings-chart` - Gráfico de ganhos

## 🧪 Testando a API

Use o script de teste incluído:
```bash
npm run test
```

Este script irá:
- ✅ Verificar se o servidor está rodando
- ✅ Registrar um usuário de teste
- ✅ Fazer login
- ✅ Testar endpoints principais
- ✅ Verificar integração com Binance

## 🔍 Verificação de Funcionamento

### 1. Servidor Rodando
```bash
curl http://localhost:5000/health
# Deve retornar: {"status":"ok","message":"CryptoGain API is running"}
```

### 2. Banco Conectado
Verificar logs do servidor para:
```
✅ Conectado ao banco de dados PostgreSQL
```

### 3. Binance API Funcionando
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/binance/prices
# Deve retornar lista de preços
```

## 🚨 Solução de Problemas

### Erro de Conexão com Banco
```
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Verificar credenciais no .env
# Testar conexão manualmente
psql postgresql://username:password@localhost:5432/cryptogain_db
```

### Erro na Binance API
```
# Verificar chaves no .env
# Testar chaves na Binance
# Verificar permissões da API
# Usar testnet para desenvolvimento
```

### Porta Já em Uso
```bash
# Matar processo na porta 5000
lsof -ti:5000 | xargs kill -9

# Ou usar porta diferente no .env
PORT=5001
```

## 📱 Próximos Passos

1. **Frontend**: Atualizar outras páginas para usar dados reais
2. **Testes**: Criar testes automatizados
3. **Deploy**: Configurar servidor de produção
4. **Monitoramento**: Adicionar logs e alertas

## 📞 Suporte

- Verificar logs: `tail -f logs/app.log`
- Testar endpoints individualmente com Postman
- Verificar documentação completa em `backend/README.md`

---

**🎉 Backend configurado com sucesso! Agora você tem uma API completa para seu app de criptomoedas.**
