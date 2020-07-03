const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verifyToken, verifyRole } = require('../middlewares/auth');

app.get('/user', verifyToken, (req, res) => {
  let start = Number(req.query.start) || 0;
  let limit = Number(req.query.limit) || 5;

  User.find({ status: true }, 'name email role status google')
    .skip(start)
    .limit(limit)
    .exec((error, result) => {
      if (error) {
        return res.status(400).json({
          ok: false,
          message: error.message,
          error,
        });
      }

      User.countDocuments({ status: true }, (error, data) => {
        if (error) {
          return res.status(400).json({
            ok: false,
            message: error.message,
            error,
          });
        }

        res.status(200).json({
          ok: true,
          users: result,
          userNumber: data,
        });
      });
    });
});

app.post('/user', [verifyToken, verifyRole], (req, res) => {
  let body = req.body;
  let user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  });

  user.save((error, result) => {
    if (error) {
      return res.status(400).json({
        ok: false,
        message: error.message,
        error,
      });
    }

    res.json({
      ok: true,
      users: result,
    });
  });
});

app.put('/user/:id', [verifyToken, verifyRole], (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['name', 'email', 'image', 'role', 'status']);

  // delete body.password;
  // delete body.google;

  // User.findById(id, (err, result) => {
  //   if (err) {
  //     return res.status(400).json({
  //       ok: false,
  //       message: err.message,
  //       err,
  //     });
  //   }
  //   result.update(body, (error, data) => {
  //     if (error) {
  //       return res.status(400).json({
  //         ok: false,
  //         message: error.message,
  //         error,
  //       });
  //     }
  //     res.json({
  //       ok: true,
  //       user: result,
  //     });
  //   });
  // });

  User.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (error, result) => {
      if (error) {
        return res.status(400).json({
          ok: false,
          message: error.message,
          error,
        });
      }
      res.json({
        ok: true,
        user: result,
      });
    }
  );
});

app.delete('/user/:id', [verifyToken, verifyRole], (req, res) => {
  let id = req.params.id;
  // User.findByIdAndRemove(id, {}, (error, result) => {
  //   if (error) {
  //     return res.status(400).json({
  //       ok: false,
  //       message: error.message,
  //       error,
  //     });
  //   }

  //   if (result === null) {
  //     return res.status(400).json({
  //       ok: false,
  //       error: {
  //         message: `Usuario ${id} no encontrado`,
  //       },
  //     });
  //   }

  //   res.json({
  //     ok: true,
  //     user: result,
  //   });
  // });

  let user = { status: false };
  User.findByIdAndUpdate(id, user, { new: true }, (error, result) => {
    if (error) {
      return res.status(400).json({
        ok: false,
        message: error.message,
        error,
      });
    }
    res.json({
      ok: true,
      user: result,
    });
  });
});

module.exports = app;
