require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const applicantRoutes = require('./routes/applicants');
const scoreRoutes = require('./routes/score');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'Credit scoring backend running' });
});

app.use('/auth', authRoutes);
app.use('/applicants', applicantRoutes);
app.use('/score', scoreRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
