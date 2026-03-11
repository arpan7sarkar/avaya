require('dotenv').config();

const app = require('../src/app');
const { initDB } = require('../src/db');

let dbInitialized = false;

module.exports = async (req, res) => {
  if (!dbInitialized) {
    try {
      await initDB();
      dbInitialized = true;
      console.log('✅ Database initialised (serverless cold start)');
    } catch (err) {
      console.error('❌ Database init failed:', err.message);
      return res.status(503).json({ error: 'Service temporarily unavailable. DB init failed.' });
    }
  }
  return app(req, res);
};
