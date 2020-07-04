const express = require('express');
const app = express();

const userRoute = require('./user');
const loginRoute = require('./login');
const categoryRoute = require('./category');
const productRoute = require('./product');

app.use(userRoute);
app.use(loginRoute);
app.use(categoryRoute);
app.use(productRoute);

module.exports = app;
