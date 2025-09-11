# Backend CryptoGain - API REST

Backend completo para aplicação de investimento em criptomoedas com funcionalidades reais de depósito e retirada via Binance API.

## Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Axios** - Cliente HTTP para APIs externas
- **Binance API** - Integração com exchange

## Funcionalidades

### Autenticação
- Registro de usuários
- Login com JWT
- Perfil do usuário

### Carteira
- Gerenciamento de saldo
- Endereços de depósito
- Histórico de transações

### Investimentos
- Planos de investimento
- Investimentos ativos
- Cálculo automático de ganhos diários
- Retirada de lucros

### Transações
- Depósitos via Binance
- Retiradas para carteiras externas
- Histórico completo

### Integração Binance
- Preços em tempo real
- Informações da conta
- Histórico de depósitos/retiradas
- Geração de endereços de depósito

## Instalação

1. **Instalar dependências:**
   ```bash
   cd backend
   npm install
   ```

2. **Configurar banco de dados PostgreSQL:**
   - Criar banco de dados `cryptogain_db`
   - Atualizar `DATABASE_URL` no arquivo `.env`

3. **Configurar variáveis de ambiente:**
   - Copiar `.env.example` para `.env`
   - Preencher chaves da API Binance
   - Configurar JWT_SECRET

4. **Inicializar banco de dados:**
   ```bash
   node init-db.js
   ```

5. **Iniciar servidor:**
   ```bash
   npm start
   # ou para desenvolvimento
   npm run dev
   ```

## Estrutura do Projeto

```
backend/
├── config/
│   └── database.js          # Conexão PostgreSQL
├── middleware/
│   └── auth.js             # Middleware de autenticação JWT
├── models/
│   ├── User.js             # Modelo de usuário
│   ├── Wallet.js           # Modelo de carteira
│   ├── Transaction.js      # Modelo de transação
│   └── Investment.js       # Modelo de investimento
├── routes/
│   ├── auth.js             # Rotas de autenticação
│   ├── wallet.js           # Rotas da carteira
│   ├── transaction.js      # Rotas de transações
│   ├── investment.js       # Rotas de investimentos
│   └── binance.js          # Rotas de integração Binance
├── .env                    # Variáveis de ambiente
├── init-db.js             # Script de inicialização do banco
├── package.json           # Dependências
├── README.md              # Documentação
└── server.js              # Servidor principal
```

## API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil do usuário

### Carteira
- `GET /api/wallet` - Informações da carteira
- `GET /api/wallet/deposit-address/:currency` - Endereço de depósito

### Transações
- `GET /api/transactions` - Histórico de transações
- `POST /api/transactions/deposit` - Criar depósito
- `POST /api/transactions/withdrawal` - Criar retirada

### Investimentos
- `GET /api/investments/plans` - Planos disponíveis
- `GET /api/investments` - Investimentos do usuário
- `POST /api/investments` - Criar investimento
- `DELETE /api/investments/:id` - Cancelar investimento

### Dashboard
- `GET /api/dashboard/stats` - Estatísticas
- `GET /api/dashboard/earnings-chart` - Gráfico de ganhos
- `GET /api/dashboard/portfolio` - Dados do portfólio
- `GET /api/dashboard/balance-history` - Histórico de saldo

### Binance
- `GET /api/binance/prices` - Preços das criptos
- `GET /api/binance/account` - Informações da conta
- `GET /api/binance/deposits` - Histórico de depósitos
- `GET /api/binance/withdrawals` - Histórico de retiradas

## Configuração da Binance API

1. Criar conta na Binance
2. Gerar chaves API (habilitar permissões de leitura/escrita)
3. Configurar no arquivo `.env`:
   ```
   BINANCE_API_KEY=your_api_key
   BINANCE_SECRET_KEY=your_secret_key
   BINANCE_USDT_ADDRESS=your_deposit_address
   ```

## Desenvolvimento

### Scripts Disponíveis
- `npm start` - Iniciar servidor em produção
- `npm run dev` - Iniciar servidor em desenvolvimento (com nodemon)
- `node init-db.js` - Inicializar banco de dados

### Estrutura do Banco de Dados

#### Tabelas Principais
- **users** - Usuários do sistema
- **wallets** - Carteiras dos usuários
- **investment_plans** - Planos de investimento
- **investments** - Investimentos ativos
- **transactions** - Histórico de transações

### Segurança
- Autenticação JWT
- Hash de senhas com bcrypt
- Rate limiting
- CORS configurado
- Helmet para headers de segurança

## Testes

Para testar a API, você pode usar ferramentas como:
- Postman
- Insomnia
- Thunder Client (VS Code)

## Deploy

### Produção
1. Configurar variáveis de ambiente para produção
2. Usar PostgreSQL em produção
3. Configurar processo de backup
4. Monitorar logs e performance

### Desenvolvimento
1. Usar testnet da Binance para testes
2. Configurar banco local
3. Usar dados de teste

## Suporte

Para dúvidas ou problemas, verificar:
- Logs do servidor
- Documentação da Binance API
- Issues no repositório

## Licença

Este projeto é privado e confidencial.
