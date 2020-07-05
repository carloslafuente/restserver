const _ = require('underscore');
const Category = require('../models/category.model');

const getAllCategories = (req, res) => {
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
};

const getCategoryById = (req, res) => {
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
};

const createCategory = (req, res) => {
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
};

const updateCategory = (req, res) => {
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
};

const removeCategory = (req, res) => {
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
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  removeCategory,
};
