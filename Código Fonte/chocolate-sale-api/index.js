// index.js
require('dotenv').config();
const express = require('express');
const allRoutes = require('./routes'); 

const app = express();
const PORT = process.env.APP_PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Routes
app.use('/api', allRoutes);

// Basic error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});


app.listen(PORT, () => {
  console.log(`Main Chocolate Sales API server running on port ${PORT}`);
  console.log(`Access API at http://localhost:${PORT}/api`);
});