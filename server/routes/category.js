const express = require('express');
const app = express();
const _ = require('underscore');
const { verifyToken, verifyRole } = require('../middlewares/auth');
const Category = require('../models/category');

app.get('/category', verifyToken, (req, res) => {
  Category.find({})
    .sort('name')
    .exec((error, result) => {
      if (error) {
        return res.status(400).json({
          ok: false,
          message: error.message,
          error,
        });
      }

      Category.countDocuments({}, (error, count) => {
        if (error) {
          return res.status(400).json({
            ok: false,
            message: error.message,
            error,
          });
        }

        Category.populate(
          result,
          { path: 'creator', select: { _id: 1, name: 1, email: 1 } },
          (error, data) => {
            if (error) {
              return res.status(400).json({
                ok: false,
                message: error.message,
                error,
              });
            }
            res.status(200).json({
              ok: true,
              categories: data,
              categoryNumber: count,
            });
          }
        );
      });
    });
});

app.get('/category/:id', verifyToken, (req, res) => {
  let id = req.params.id;
  Category.findById(id, (error, result) => {
    if (error) {
      return res.status(400).json({
        ok: false,
        message: error.message,
        error,
      });
    }
    if (result === null) {
      return res.status(400).json({
        ok: false,
        error: {
          message: `No existe la categoria con el id: ${id}`,
        },
      });
    }
    Category.populate(result, { path: 'creator' }, (error, data) => {
      if (error) {
        return res.status(400).json({
          ok: false,
          message: error.message,
          error,
        });
      }
      res.status(200).json({
        ok: true,
        categories: data,
      });
    });
  });
});

app.post('/category', [verifyToken, verifyRole], (req, res) => {
  let category = new Category({
    name: req.body.name,
    description: req.body.description,
    creator: req.user._id,
  });

  category.save((error, result) => {
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
          message: 'No se pudo crear la categoria',
        },
      });
    }
    res.status(200).json({
      ok: true,
      categories: result,
    });
  });
});

app.put('/category/:id', [verifyToken, verifyRole], (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['name', 'description']);

  Category.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (error, result) => {
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
            message: `No existe la categoria con el id: ${id}`,
          },
        });
      }
      res.status(200).json({
        ok: true,
        categories: result,
      });
    }
  );
});

app.delete('/category/:id', [verifyToken, verifyRole], (req, res) => {
  let id = req.params.id;
  Category.findByIdAndRemove(id, (error, result) => {
    if (error) {
      return res.status(500).json({
        ok: false,
        error,
      });
    }
    res.status(200).json({
      ok: true,
      categories: result,
    });
  });
});

module.exports = app;
