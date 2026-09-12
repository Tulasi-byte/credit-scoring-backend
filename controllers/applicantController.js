const pool = require('../config/db');

// POST /applicants
async function createApplicant(req, res) {
  const { name, phone, features } = req.body;

  if (!name || !features) {
    return res.status(400).json({ error: 'name and features are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO applicants (name, phone) VALUES (?, ?)',
      [name, phone || null]
    );
    const applicantId = result.insertId;

    await pool.query(
      `INSERT INTO applicant_features
       (applicant_id, utility_payment_score, mobile_recharge_regularity, rent_payment_score, upi_transaction_frequency)
       VALUES (?, ?, ?, ?, ?)`,
      [
        applicantId,
        features.utility_payment_score,
        features.mobile_recharge_regularity,
        features.rent_payment_score,
        features.upi_transaction_frequency,
      ]
    );

    res.status(201).json({ id: applicantId, name, phone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create applicant' });
  }
}

// GET /applicants/:id
async function getApplicant(req, res) {
  const { id } = req.params;

  try {
    const [applicantRows] = await pool.query(
      'SELECT * FROM applicants WHERE id = ?',
      [id]
    );
    if (applicantRows.length === 0) {
      return res.status(404).json({ error: 'Applicant not found' });
    }

    const [featureRows] = await pool.query(
      'SELECT * FROM applicant_features WHERE applicant_id = ?',
      [id]
    );

    const [scoreRows] = await pool.query(
      'SELECT * FROM scores WHERE applicant_id = ? ORDER BY created_at DESC',
      [id]
    );

    res.json({
      applicant: applicantRows[0],
      features: featureRows[0] || null,
      scoreHistory: scoreRows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch applicant' });
  }
}

// GET /applicants
async function listApplicants(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT a.id, a.name, a.phone, s.score, s.risk_tier, s.created_at AS scored_at
       FROM applicants a
       LEFT JOIN scores s ON s.applicant_id = a.id
       ORDER BY a.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list applicants' });
  }
}

module.exports = { createApplicant, getApplicant, listApplicants };
