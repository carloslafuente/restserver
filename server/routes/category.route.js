const express = require('express');
const app = express();
const { verifyToken, verifyRole } = require('../middlewares/auth.middleware');
const category = require('../controllers/category.controller');

app.get('/category', verifyToken, category.getAllCategories);

app.get('/category/:id', verifyToken, category.getCategoryById);

app.post('/category', [verifyToken, verifyRole], category.createCategory);

app.put('/category/:id', [verifyToken, verifyRole], category.updateCategory);

app.delete('/category/:id', [verifyToken, verifyRole], category.removeCategory);

module.exports = app;
