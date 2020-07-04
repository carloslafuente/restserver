const express = require('express');
const app = express();
const { verifyToken, verifyRole } = require('../middlewares/auth');
const Product = require('../models/product');
const _ = require('underscore');

app.get('/product', verifyToken, async (req, res) => {
  let products;
  let count;
  let start = Number(req.query.start) || 0;
  let limit = Number(req.query.skip) || 5;
  try {
    products = await Product.find({ status: true })
      .skip(start)
      .limit(limit)
      .sort('name')
      .populate('creator', '_id name email')
      .populate('category', '_id, name description')
      .exec();
    count = await Product.countDocuments({ status: true });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error,
    });
  }
  if (products === null) {
    return res.status(400).json({
      ok: false,
      error: {
        message: `No se pudo cargar la lista de productos`,
      },
    });
  }
  res.status(200).json({
    ok: true,
    products,
    count,
  });
});

app.get('/product/:id', verifyToken, async (req, res) => {
  let id = req.params.id;
  let products;
  try {
    products = await Product.findOne({ _id: id, status: true })
      .populate('creator')
      .populate('category')
      .exec();
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error,
    });
  }
  if (products === null || products.length === 0) {
    return res.status(400).json({
      ok: false,
      error: {
        message: `No existe el producto con el id: ${id}`,
      },
    });
  }
  res.status(200).json({
    ok: true,
    products,
  });

  // Product.findById(id)
  //   .where('status')
  //   .equals(true)
  //   .populate('creator')
  //   .populate('category')
  //   .exec((error, result) => {
  //     if (error) {
  //       return res.status(500).json({
  //         ok: false,
  //         error,
  //       });
  //     }
  //     if (result === null) {
  //       return res.status(500).json({
  //         ok: false,
  //         error: {
  //           message: `No existe el producto con el id: ${id}`,
  //         },
  //       });
  //     }
  //     res.status(200).json({
  //       ok: true,
  //       products: result,
  //     });
  //   });
});

app.post('/product', [verifyToken, verifyRole], async (req, res) => {
  let product = new Product({
    name: req.body.name,
    unitPrice: req.body.unitPrice,
    description: req.body.description,
    category: req.body.category,
    creator: req.user._id,
  });
  let products;
  try {
    products = await product.save();
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error,
    });
  }
  if (products === null) {
    return res.status(400).json({
      ok: false,
      error: {
        message: `Error al crear el producto`,
      },
    });
  }
  res.status(201).json({
    ok: true,
    products,
  });
});

app.put('/product/:id', [verifyToken, verifyRole], async (req, res) => {
  let id = req.params.id;
  let product = _.pick(req.body, [
    'name',
    'unitPrice',
    'description',
    'category',
  ]);
  let products;
  try {
    products = await await Product.findByIdAndUpdate(id, product, {
      new: true,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error,
    });
  }
  if (products === null) {
    return res.status(400).json({
      ok: false,
      error: {
        message: `No existe el producto con el id: ${id}`,
      },
    });
  }
  res.status(200).json({
    ok: true,
    products,
  });
});

app.delete('/product/:id', [verifyToken, verifyRole], async (req, res) => {
  let id = req.params.id;
  let product = {
    status: false,
  };
  let products;
  try {
    products = await await Product.findByIdAndUpdate(id, product, {
      new: true,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error,
    });
  }
  if (products === null) {
    return res.status(400).json({
      ok: false,
      error: {
        message: `No existe el producto con el id: ${id}`,
      },
    });
  }
  res.status(200).json({
    ok: true,
    products,
  });
});

app.get('/product/find/:term', verifyToken, async (req, res) => {
  let term = req.params.term;
  let regex = new RegExp(term, 'i');
  let products;
  try {
    products = await Product.find({ name: regex, status: true })
      .populate('category')
      .populate('creator')
      .exec();
  } catch (error) {
    if (error) {
      return res.status(500).json({
        ok: false,
        error,
      });
    }
  }
  if (products === null) {
    return res.status(500).json({
      ok: false,
      error: {
        message: `No hay resultados que coincidan con el termino: ${term}`,
      },
    });
  }
  res.status(200).json({
    ok: true,
    products,
  });
});

module.exports = app;
