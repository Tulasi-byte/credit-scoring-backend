const axios = require('axios');
const pool = require('../config/db');

// POST /score  { applicantId }
async function scoreApplicant(req, res) {
  const { applicantId } = req.body;

  if (!applicantId) {
    return res.status(400).json({ error: 'applicantId is required' });
  }

  try {
    const [featureRows] = await pool.query(
      'SELECT * FROM applicant_features WHERE applicant_id = ?',
      [applicantId]
    );

    if (featureRows.length === 0) {
      return res.status(404).json({ error: 'No features found for this applicant' });
    }

    const features = featureRows[0];

    // Call the Python ML microservice
    const mlResponse = await axios.post(`${process.env.ML_SERVICE_URL}/score`, {
      utility_payment_score: features.utility_payment_score,
      mobile_recharge_regularity: features.mobile_recharge_regularity,
      rent_payment_score: features.rent_payment_score,
      upi_transaction_frequency: features.upi_transaction_frequency,
    });

    const { score, risk_tier, explanation } = mlResponse.data;

    await pool.query(
      'INSERT INTO scores (applicant_id, score, risk_tier, explanation) VALUES (?, ?, ?, ?)',
      [applicantId, score, risk_tier, JSON.stringify(explanation)]
    );

    res.json({ applicantId, score, risk_tier, explanation });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Scoring failed' });
  }
}

module.exports = { scoreApplicant };
