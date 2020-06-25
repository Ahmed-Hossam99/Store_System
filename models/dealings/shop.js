const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shopSchema = new Schema({
  shopName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,

  },
  cashier: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
  },
})

module.exports = mongoose.model('Shops', shopSchema, 'Shops');