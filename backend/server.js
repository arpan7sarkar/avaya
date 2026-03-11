require('dotenv').config();

const app = require('./src/app');
const { initDB } = require('./src/db');

const PORT = process.env.PORT || 5000;
const env = process.env.NODE_ENV || 'development';

async function start() {
  try {
    // Initialise database (extensions, tables, triggers, views)
    await initDB();
    console.log(`✅ Database connected and initialised (${env})`);

    const server = app.listen(PORT, () => {
      console.log(`🚀 Avaya backend running on http://localhost:${PORT} [${env}]`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please stop the other process.`);
      } else {
        console.error('❌ Server error:', err.message);
      }
      process.exit(1);
    });

  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
