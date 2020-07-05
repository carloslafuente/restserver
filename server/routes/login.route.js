const express = require('express');
const app = express();
const user = require('../controllers/user.controller');

app.post('/login', user.loginUser);

app.post('/google', user.loginGoogleUser);

module.exports = app;
