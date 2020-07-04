require('../config/config');
const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return {
    name: payload.name,
    email: payload.email,
    image: payload.picture,
    google: true,
  };
}

app.post('/google', async (req, res) => {
  let googleToken = req.body.googleToken;
  let googleUser = await verify(googleToken).catch((error) => {
    return res.status(403).json({
      ok: false,
      error,
    });
  });

  User.findOne({ email: googleUser.email }, (error, result) => {
    if (error) {
      return res.status(500).json({
        ok: false,
        error,
      });
    }
    if (result) {
      if (!result.google) {
        return res.status(400).json({
          ok: false,
          error: {
            message: `Debe de usar su autenticacion por correo y contraseña`,
          },
        });
      } else {
        const token = jwt.sign(
          { user: result },
          process.env.JWT_SECRET.toString(),
          {
            expiresIn: process.env.EXPIRATION_VALUE,
          }
        );
        return res.json({
          ok: true,
          user: result,
          token,
        });
      }
    } else {
      let user = new User();

      user.name = googleUser.name;
      user.email = googleUser.email;
      user.image = googleUser.image;
      user.google = true;
      user.password = 'XD';

      console.log(user.image);

      user.save((error, data) => {
        if (error) {
          return res.status(500).json({
            ok: false,
            error,
          });
        }

        const token = jwt.sign(
          { user: result },
          process.env.JWT_SECRET.toString(),
          {
            expiresIn: process.env.EXPIRATION_VALUE,
          }
        );

        return res.json({
          ok: true,
          user: data,
          token,
        });
      });
    }
  });
});

module.exports = app;
