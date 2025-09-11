const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { email, password, name, username } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (username, email, password_hash, full_name, balance_usdt)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, username, email, full_name, balance_usdt, created_at
    `;

    try {
      const result = await pool.query(query, [username, email, hashedPassword, name, 0]);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('Email ou username já existe');
      }
      throw error;
    }
  }

  static async findByEmail(email) {
    const query = `
      SELECT id, username, email, full_name, balance_usdt, total_invested, total_earnings,
             is_admin, is_active, created_at
      FROM users WHERE email = $1
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT id, username, email, full_name, balance_usdt, total_invested, total_earnings,
             is_admin, is_active, created_at
      FROM users WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateBalance(id, amount) {
    const query = `
      UPDATE users
      SET balance_usdt = balance_usdt + $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING balance_usdt
    `;
    const result = await pool.query(query, [id, amount]);
    return result.rows[0];
  }

  static async updateProfile(id, profileData) {
    const { full_name, phone } = profileData;
    const query = `
      UPDATE users
      SET full_name = $2, phone = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, username, email, full_name, phone, balance_usdt, created_at
    `;
    const result = await pool.query(query, [id, full_name, phone]);
    return result.rows[0];
  }

  static async getAllUsers() {
    const query = `
      SELECT id, username, email, full_name, balance_usdt, total_invested, total_earnings,
             is_admin, is_active, created_at
      FROM users ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Método para criar usuários de teste
  static async createTestUsers() {
    const testUsers = [
      {
        username: 'admin',
        email: 'admin@cryptovault.com',
        password: 'password123',
        name: 'Admin User',
        is_admin: true
      },
      {
        username: 'investor',
        email: 'investor@example.com',
        password: 'password123',
        name: 'Test Investor',
        is_admin: false
      }
    ];

    for (const userData of testUsers) {
      try {
        const existingUser = await this.findByEmail(userData.email);
        if (!existingUser) {
          await this.create(userData);
          console.log(`Usuário de teste criado: ${userData.email}`);
        }
      } catch (error) {
        console.error(`Erro ao criar usuário de teste ${userData.email}:`, error.message);
      }
    }
  }
}

module.exports = User;
