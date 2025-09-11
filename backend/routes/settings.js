const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/logos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas arquivos de imagem são permitidos!'));
    }
  }
});

// Get settings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT * FROM settings
      WHERE id = 1
    `;

    const result = await pool.query(query);

    if (result.rows.length === 0) {
      // Return default settings if none exist
      return res.json({
        companyName: 'CryptoGain',
        companyEmail: 'admin@cryptogain.com',
        companyPhone: '+55 11 99999-9999',
        companyAddress: 'São Paulo, SP',
        companyLogo: '',
        siteTitle: 'CryptoGain - Plataforma de Investimento',
        siteDescription: 'Plataforma completa para investimento em criptomoedas',
        maintenanceMode: false,
        registrationEnabled: true
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Update settings
router.put('/', authenticateToken, async (req, res) => {
  try {
    const {
      companyName,
      companyEmail,
      companyPhone,
      companyAddress,
      companyLogo,
      siteTitle,
      siteDescription,
      maintenanceMode,
      registrationEnabled
    } = req.body;

    // Check if settings exist
    const checkQuery = 'SELECT id FROM settings WHERE id = 1';
    const checkResult = await pool.query(checkQuery);

    let query;
    let values;

    if (checkResult.rows.length === 0) {
      // Insert new settings
      query = `
        INSERT INTO settings (
          id, company_name, company_email, company_phone, company_address,
          company_logo, site_title, site_description, maintenance_mode, registration_enabled
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;
      values = [
        1, companyName, companyEmail, companyPhone, companyAddress,
        companyLogo, siteTitle, siteDescription, maintenanceMode, registrationEnabled
      ];
    } else {
      // Update existing settings
      query = `
        UPDATE settings SET
          company_name = $1,
          company_email = $2,
          company_phone = $3,
          company_address = $4,
          company_logo = $5,
          site_title = $6,
          site_description = $7,
          maintenance_mode = $8,
          registration_enabled = $9,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $10
        RETURNING *
      `;
      values = [
        companyName, companyEmail, companyPhone, companyAddress,
        companyLogo, siteTitle, siteDescription, maintenanceMode, registrationEnabled, 1
      ];
    }

    const result = await pool.query(query, values);

    res.json({
      message: 'Configurações salvas com sucesso',
      settings: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Erro ao salvar configurações' });
  }
});

// Upload logo
router.post('/upload-logo', authenticateToken, upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
    }

    const logoUrl = `/uploads/logos/${req.file.filename}`;

    // Update settings with new logo
    const query = `
      UPDATE settings SET
        company_logo = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `;

    await pool.query(query, [logoUrl]);

    res.json({
      message: 'Logo enviado com sucesso',
      logoUrl: logoUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error uploading logo:', error);
    res.status(500).json({ error: 'Erro ao fazer upload do logo' });
  }
});

// Delete logo
router.delete('/logo', authenticateToken, async (req, res) => {
  try {
    // Get current logo path
    const query = 'SELECT company_logo FROM settings WHERE id = 1';
    const result = await pool.query(query);

    if (result.rows.length > 0 && result.rows[0].company_logo) {
      const logoPath = path.join(__dirname, '..', result.rows[0].company_logo);

      // Delete file if it exists
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }

    // Update settings to remove logo
    const updateQuery = `
      UPDATE settings SET
        company_logo = NULL,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `;

    await pool.query(updateQuery);

    res.json({ message: 'Logo removido com sucesso' });
  } catch (error) {
    console.error('Error deleting logo:', error);
    res.status(500).json({ error: 'Erro ao remover logo' });
  }
});

module.exports = router;
