const fs = require('fs').promises;
const path = require('path');

class Transaction {
  static dataFile = path.join(__dirname, '../data/transactions.json');

  static async ensureDataFile() {
    try {
      await fs.access(this.dataFile);
    } catch {
      await fs.mkdir(path.dirname(this.dataFile), { recursive: true });
      await fs.writeFile(this.dataFile, JSON.stringify([]));
    }
  }

  static async readData() {
    await this.ensureDataFile();
    const data = await fs.readFile(this.dataFile, 'utf8');
    return JSON.parse(data);
  }

  static async writeData(data) {
    await this.ensureDataFile();
    await fs.writeFile(this.dataFile, JSON.stringify(data, null, 2));
  }

  static async create(transactionData) {
    const { user_id, type, amount, currency = 'USDT', status = 'pending', description, hash = null } = transactionData;

    const transactions = await this.readData();
    const newTransaction = {
      id: Date.now().toString(),
      user_id,
      type,
      amount,
      currency,
      status,
      description,
      hash,
      created_at: new Date().toISOString(),
      completed_at: null
    };

    transactions.push(newTransaction);
    await this.writeData(transactions);

    return newTransaction;
  }

  static async findByUserId(userId, limit = 50) {
    const transactions = await this.readData();
    return transactions
      .filter(tx => tx.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);
  }

  static async updateStatus(id, status) {
    const transactions = await this.readData();
    const index = transactions.findIndex(tx => tx.id === id);

    if (index !== -1) {
      transactions[index].status = status;
      if (status === 'completed') {
        transactions[index].completed_at = new Date().toISOString();
      } else {
        transactions[index].completed_at = null;
      }
      await this.writeData(transactions);
      return transactions[index];
    }

    return null;
  }

  static async getPendingWithdrawals() {
    const transactions = await this.readData();
    return transactions.filter(tx => tx.type === 'withdrawal' && tx.status === 'pending');
  }

  static async getUserStats(userId) {
    const transactions = await this.readData();
    const userTxs = transactions.filter(tx => tx.user_id === userId);

    const total_transactions = userTxs.length;
    const total_deposits = userTxs.filter(tx => tx.type === 'deposit' && tx.status === 'completed').reduce((sum, tx) => sum + tx.amount, 0);
    const total_withdrawals = userTxs.filter(tx => tx.type === 'withdrawal' && tx.status === 'completed').reduce((sum, tx) => sum + tx.amount, 0);
    const total_investments = userTxs.filter(tx => tx.type === 'investment' && tx.status === 'completed').reduce((sum, tx) => sum + tx.amount, 0);
    const total_earnings = userTxs.filter(tx => tx.type === 'earnings' && tx.status === 'completed').reduce((sum, tx) => sum + tx.amount, 0);

    return {
      total_transactions,
      total_deposits,
      total_withdrawals,
      total_investments,
      total_earnings
    };
  }
}

module.exports = Transaction;
