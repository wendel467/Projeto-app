// db_config.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false, // For services like Render/Heroku
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database!');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params, callback) => {
    const start = Date.now();
    return pool.query(text, params, (err, res) => {
      if (err) {
        console.error(`Error executing query: ${text.substring(0,100)}...`, { params: params, error: err.stack });
      }
      const duration = Date.now() - start;
      // console.log('Executed query', { text: text.substring(0,100)+"...", duration, rows: res ? res.rowCount : 0 }); // Be careful with logging sensitive data
      callback(err, res);
    });
  },
  getClient: (callback) => { // For transactions
    pool.connect((err, client, release) => {
      callback(err, client, release);
    });
  }
};