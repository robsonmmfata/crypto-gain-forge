const pool = require('../config/database');

class Wallet {
  static async create(userId, currency = 'USDT') {
    try {
      const query = `
        INSERT INTO wallets (user_id, currency, balance, available_balance)
        VALUES ($1, $2, 0, 0)
        RETURNING *
      `;

      const result = await pool.query(query, [userId, currency]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByUserId(userId, currency = 'USDT') {
    try {
      const query = 'SELECT * FROM wallets WHERE user_id = $1 AND currency = $2';
      const result = await pool.query(query, [userId, currency]);

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateBalance(userId, currency, amount, type = 'add') {
    try {
      let query;
      if (type === 'add') {
        query = `
          UPDATE wallets
          SET balance = balance + $1, available_balance = available_balance + $1, updated_at = CURRENT_TIMESTAMP
          WHERE user_id = $2 AND currency = $3
          RETURNING *
        `;
      } else if (type === 'subtract') {
        query = `
          UPDATE wallets
          SET balance = balance - $1, available_balance = available_balance - $1, updated_at = CURRENT_TIMESTAMP
          WHERE user_id = $2 AND currency = $3
          RETURNING *
        `;
      } else if (type === 'lock') {
        query = `
          UPDATE wallets
          SET available_balance = available_balance - $1, locked_balance = locked_balance + $1, updated_at = CURRENT_TIMESTAMP
          WHERE user_id = $2 AND currency = $3
          RETURNING *
        `;
      } else if (type === 'unlock') {
        query = `
          UPDATE wallets
          SET available_balance = available_balance + $1, locked_balance = locked_balance - $1, updated_at = CURRENT_TIMESTAMP
          WHERE user_id = $2 AND currency = $3
          RETURNING *
        `;
      }

      const result = await pool.query(query, [amount, userId, currency]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getAllByUserId(userId) {
    try {
      const query = 'SELECT * FROM wallets WHERE user_id = $1 ORDER BY currency';
      const result = await pool.query(query, [userId]);

      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async setAddress(userId, currency, address) {
    try {
      const query = `
        UPDATE wallets
        SET address = $1, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $2 AND currency = $3
        RETURNING *
      `;

      const result = await pool.query(query, [address, userId, currency]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Wallet;
