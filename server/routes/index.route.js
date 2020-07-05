const express = require('express');
const app = express();

const userRoute = require('./user.route');
const loginRoute = require('./login.route');
const categoryRoute = require('./category.route');
const productRoute = require('./product.route');

app.use(userRoute);
app.use(loginRoute);
app.use(categoryRoute);
app.use(productRoute);

module.exports = app;
