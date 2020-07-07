const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const upload = require('../controllers/upload.controller');

app.use(fileUpload());

app.put('/upload/:type/:id', upload.uploadFile);

module.exports = app;
