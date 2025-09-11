# Backend CryptoGain - API de Trading Crypto

Este é o backend completo para a plataforma CryptoGain, construído com Node.js, Express e PostgreSQL. Substitui os dados mockados por um sistema real de gerenciamento de usuários, investimentos, transações e integração com a API da Binance.

## 🚀 Funcionalidades

- ✅ Autenticação JWT completa (registro, login, perfil)
- ✅ Gerenciamento de carteira (saldo, depósitos, retiradas)
- ✅ Sistema de investimentos com planos pré-definidos
- ✅ Histórico completo de transações
- ✅ Integração com API da Binance para preços e transações reais
- ✅ Geração de QR codes para depósitos
- ✅ Sistema de configurações administrativas
- ✅ Middleware de autenticação e validação

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação baseada em tokens
- **bcryptjs** - Hashing de senhas
- **Axios** - Cliente HTTP para APIs externas
- **QRCode** - Geração de códigos QR
- **Crypto-JS** - Criptografia para assinaturas da Binance

## 📁 Estrutura do Projeto

```
backend/
├── config/
│   └── database.js          # Conexão com PostgreSQL
├── middleware/
│   └── auth.js              # Middleware de autenticação JWT
├── models/
│   ├── User.js              # Modelo de usuário
│   ├── Investment.js        # Modelo de investimentos
│   └── Transaction.js       # Modelo de transações
├── routes/
│   ├── auth.js              # Rotas de autenticação
│   ├── wallet.js            # Rotas da carteira
│   ├── investment.js        # Rotas de investimentos
│   ├── transaction.js       # Rotas de transações
│   ├── settings.js          # Rotas de configurações
│   └── binance-public.js    # Rotas públicas da Binance
├── .env                     # Variáveis de ambiente
├── init-db.js               # Inicialização do banco
├── server.js                # Servidor principal
├── test-api.js              # Script de teste da API
└── package.json             # Dependências
```

## 🔧 Instalação e Configuração

### 1. Instalar Dependências

```bash
cd backend
npm install
```

### 2. Configurar Banco de Dados

Certifique-se de ter o PostgreSQL instalado e rodando. Crie um banco de dados:

```sql
CREATE DATABASE cryptogain_db;
```

### 3. Configurar Variáveis de Ambiente

Edite o arquivo `.env`:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/cryptogain_db
JWT_SECRET=sua_chave_jwt_secreta_aqui
BINANCE_API_KEY=sua_api_key_binance
BINANCE_SECRET_KEY=sua_secret_key_binance
BINANCE_USDT_ADDRESS=seu_endereco_usdt_binance
```

### 4. Inicializar Banco de Dados

```bash
node init-db.js
```

### 5. Iniciar Servidor

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:5000`

## 📡 Endpoints da API

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/profile` - Obter perfil do usuário (autenticado)

### Carteira

- `GET /api/wallet/balance` - Obter saldo da carteira
- `GET /api/wallet/info` - Informações da carteira
- `GET /api/wallet/stats` - Estatísticas da carteira
- `GET /api/wallet/history` - Histórico da carteira
- `POST /api/wallet/deposit` - Criar depósito
- `POST /api/wallet/withdraw` - Criar retirada

### Investimentos

- `GET /api/investment/plans` - Listar planos de investimento
- `GET /api/investment/user` - Investimentos do usuário
- `POST /api/investment/create` - Criar investimento
- `GET /api/investment/:id` - Detalhes do investimento

### Transações

- `GET /api/transaction/history` - Histórico de transações
- `GET /api/transaction/:id` - Detalhes da transação

### Configurações

- `GET /api/settings` - Obter configurações
- `PUT /api/settings` - Atualizar configurações

### Binance (Público)

- `GET /api/binance-public/prices` - Preços das criptos
- `GET /api/binance-public/ticker/:symbol` - Ticker específico
- `GET /api/binance-public/klines/:symbol` - Dados de candlestick
- `GET /api/binance-public/deposit-address-public` - Endereço de depósito (teste)

## 🧪 Testando a API

Execute o script de teste:

```bash
node test-api.js
```

Isso irá:
1. Registrar um usuário de teste
2. Fazer login
3. Obter perfil
4. Verificar saldo
5. Listar planos de investimento
6. Verificar histórico de transações

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Após o login, inclua o token no header:

```
Authorization: Bearer <seu_token_jwt>
```

## 💰 Integração com Binance

### Configuração da API

1. Acesse [Binance API Management](https://www.binance.com/en/my/settings/api-management)
2. Crie uma nova API key
3. Ative as permissões necessárias:
   - Reading Info: Yes
   - Enable Spot & Margin Trading: Yes
   - Enable Futures: No
   - Enable Reading: Yes

### Funcionalidades Integradas

- ✅ Obter preços em tempo real
- ✅ Gerar endereços de depósito
- ✅ Processar retiradas
- ✅ Histórico de transações
- ✅ Dados de mercado (candlesticks)

## 🚀 Próximos Passos

- [ ] Configurar PostgreSQL no pgAdmin
- [ ] Testar conexão com banco de dados
- [ ] Implementar notificações em tempo real
- [ ] Adicionar validações de segurança adicionais
- [ ] Criar documentação completa da API
- [ ] Implementar testes unitários
- [ ] Configurar deploy em produção

## 📞 Suporte

Para dúvidas ou problemas, verifique:
1. Logs do servidor no terminal
2. Conexão com PostgreSQL
3. Chaves da API da Binance
4. Configurações no arquivo `.env`

## 📝 Licença

Este projeto é propriedade da CryptoGain. Todos os direitos reservados.
