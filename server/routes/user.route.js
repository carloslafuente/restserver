const express = require('express');
const app = express();
const { verifyToken, verifyRole } = require('../middlewares/auth.middleware');
const user = require('../controllers/user.controller');

app.get('/user', verifyToken, user.getAllUsers);

app.post('/user', [verifyToken, verifyRole], user.createUser);

app.put('/user/:id', [verifyToken, verifyRole], user.updateUser);

app.delete('/user/:id', [verifyToken, verifyRole], user.disableUser);

module.exports = app;
