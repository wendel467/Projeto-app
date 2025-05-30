// routes/index.js
const express = require('express');
const router = express.Router();

const clientRoutes = require('./clientRoutes');
// const sellerRoutes = require('./sellerRoutes'); // Create similarly
// const productRoutes = require('./productRoutes'); // Create similarly
// const stockRoutes = require('./stockRoutes'); // Create similarly
// const saleRoutes = require('./saleRoutes'); // Create similarly

router.get('/', (req, res) => {
  res.send('Chocolate Sales API - Main Application v1.0');
});

router.use('/clients', clientRoutes);
// router.use('/sellers', sellerRoutes);
// router.use('/products', productRoutes);
// router.use('/stock', stockRoutes);
// router.use('/sales', saleRoutes);

module.exports = router;