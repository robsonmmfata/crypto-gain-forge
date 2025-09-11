const fs = require('fs').promises;
const path = require('path');

class Investment {
  static dataFile = path.join(__dirname, '../data/investments.json');

  // Garantir que o arquivo de dados existe
  static async ensureDataFile() {
    try {
      await fs.access(this.dataFile);
    } catch {
      await fs.mkdir(path.dirname(this.dataFile), { recursive: true });
      await fs.writeFile(this.dataFile, JSON.stringify([]));
    }
  }

  // Ler dados do arquivo
  static async readData() {
    await this.ensureDataFile();
    const data = await fs.readFile(this.dataFile, 'utf8');
    return JSON.parse(data);
  }

  // Escrever dados no arquivo
  static async writeData(data) {
    await this.ensureDataFile();
    await fs.writeFile(this.dataFile, JSON.stringify(data, null, 2));
  }

  static async create(investmentData) {
    const { user_id, plan_id, amount, daily_return, total_return, duration, status = 'active' } = investmentData;

    const investments = await this.readData();
    const newInvestment = {
      id: Date.now().toString(),
      user_id,
      plan_id,
      amount,
      daily_return,
      total_return,
      duration,
      status,
      earnings: 0,
      created_at: new Date().toISOString(),
      completed_at: null
    };

    investments.push(newInvestment);
    await this.writeData(investments);

    return newInvestment;
  }

  static async findByUserId(userId) {
    const investments = await this.readData();
    return investments.filter(inv => inv.user_id === userId);
  }

  static async findById(id) {
    const investments = await this.readData();
    return investments.find(inv => inv.id === id);
  }

  static async findActive() {
    const investments = await this.readData();
    return investments.filter(inv => inv.status === 'active');
  }

  static async updateEarnings(id, earnings) {
    const investments = await this.readData();
    const index = investments.findIndex(inv => inv.id === id);

    if (index !== -1) {
      investments[index].earnings += earnings;
      await this.writeData(investments);
      return investments[index];
    }

    return null;
  }

  static async updateStatus(id, status) {
    const investments = await this.readData();
    const index = investments.findIndex(inv => inv.id === id);

    if (index !== -1) {
      investments[index].status = status;
      if (status === 'completed') {
        investments[index].completed_at = new Date().toISOString();
      }
      await this.writeData(investments);
      return investments[index];
    }

    return null;
  }
}

module.exports = Investment;
