const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  barCode: {
    type: String,
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  purchase_price: {
    type: Number,
    required: true
  },
  sales_price: {
    type: Number,
    required: true
  },
  avaliableQuantity: {
    type: Number,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  size: {
    type: Schema.Types.ObjectId,
    ref: 'Size',
  },
  color: {
    type: Schema.Types.ObjectId,
    ref: 'Color',
  }

});

module.exports = mongoose.model('Product', productSchema);


