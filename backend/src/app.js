const express = require('express');
const cors = require('cors');
const roadsRouter     = require('./routes/roads');
const policeRouter    = require('./routes/police');
const communityRouter = require('./routes/community');
const errorHandler    = require('./middleware/errorHandler');

const app = express();

// ── Middleware ───────────────────────────────────────────────────
const isProd = process.env.NODE_ENV === 'production';
app.use(cors({
  origin: isProd ? (process.env.FRONTEND_URL || '*') : '*',
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));  // cap body size

// ── Health check ────────────────────────────────────────────────
const { pool } = require('./db');
app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected', env: process.env.NODE_ENV || 'development', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(503).json({ status: 'error', db: 'disconnected', error: err.message });
  }
});
app.get('/', (_req, res) => {
  res.json({ message: 'Welcome to Avaya Backend 🌸' });
});

// ── Routes ──────────────────────────────────────────────────────
app.use('/api/roads',     roadsRouter);
app.use('/api/police',    policeRouter);
app.use('/api/community', communityRouter);

// ── 404 handler ─────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global error handler (must be last) ─────────────────────────
app.use(errorHandler);

module.exports = app;
