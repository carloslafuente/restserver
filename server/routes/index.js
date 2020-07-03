const express = require('express');
const app = express();

const userRoute = require('./user');
const loginRoute = require('./login');

app.use(userRoute);
app.use(loginRoute);

module.exports = app;
