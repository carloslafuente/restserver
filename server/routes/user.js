const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const user = require('../models/user');

app.get('/user', (req, res) => {
  
  user.find({}).exec()

});

app.post('/user', (req, res) => {
  let body = req.body;
  let user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  });

  user.save((err, result) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        message: err.message,
        err,
      });
    }
    res.json({
      ok: true,
      user: result,
    });
  });
});

app.put('/user/:id', (req, res) => {
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
    (err, result) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: err.message,
          err,
        });
      }
      res.json({
        ok: true,
        user: result,
      });
    }
  );
});

app.delete('/user/:id', (req, res) => {
  res.json('delete User');
});

module.exports = app;
