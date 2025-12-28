const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process. env.DB_HOST || 'localhost',
  port: process. env.DB_PORT || 5432,
  user: process. env.DB_USER || 'postgres',
  password: process. env.DB_PASSWORD || 'password',
  database: process. env.DB_NAME || 'habibi_hosting'
});

pool.on('connect', () => {
  console.log('✅ Database connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

module.exports = pool;
