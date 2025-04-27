// app.js (minimal example for testing)
const express = require('express');
const { router: productRouter } = require('./productRoutes'); // Adjust path if needed

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use('/api/products', productRouter);

module.exports = app;