const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productoSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es necesario'],
  },
  unitPrice: {
    type: Number,
    required: [true, 'El precio unitario es necesario'],
  },
  description: {
    type: String,
    required: false,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'category',
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  image: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model('product', productoSchema, 'products');
