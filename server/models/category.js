const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let categorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es necesario'],
  },
  description: {
    type: String,
    required: false,
  },
  creator: {
    type: Schema.ObjectId,
    ref: 'user',
  },
});

module.exports = mongoose.model('category', categorySchema, 'categories');
