require('../config/config');
const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {
  let body = req.body;

  User.findOne({ email: body.email }, (error, result) => {
    if (error) {
      return res.status(500).json({
        ok: false,
        message: error.message,
        error,
      });
    }

    if (result === null) {
      return res.status(400).json({
        ok: false,
        error: {
          message: `Usuario o contraseña incorrecto`,
        },
      });
    }

    if (!bcrypt.compareSync(body.password, result.password)) {
      return res.status(400).json({
        ok: false,
        error: {
          message: `Usuario o contraseña incorrecto`,
        },
      });
    }
    const token = jwt.sign(
      { user: result },
      process.env.JWT_SECRET.toString(),
      {
        expiresIn: process.env.EXPIRATION_VALUE,
      }
    );

    res.json({
      ok: true,
      user: result,
      token,
    });
  });
});

module.exports = app;
