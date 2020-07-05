const express = require('express');
const app = express();
const { verifyToken, verifyRole } = require('../middlewares/auth.middleware');
const product = require('../controllers/product.controller');

app.get('/product', verifyToken, product.getAllProducts);

app.get('/product/:id', verifyToken, product.getProductById);

app.post('/product', [verifyToken, verifyRole], product.createProduct);

app.put('/product/:id', [verifyToken, verifyRole], product.updateProduct);

app.delete('/product/:id', [verifyToken, verifyRole], product.disableProduct);

app.get('/product/find/:term', verifyToken, product.searchProductByTerm);

module.exports = app;
