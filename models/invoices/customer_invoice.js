const mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

const shopInvoiceSchema = new Schema({
  // خاصه ب الادمن حين الاستيراد 
  Invoice_type: {
    type: String,
    enum: ['sales invoice', ' Return invoice'],
    required: true
  },
  Invoice_number: {
    type: Number,
    default: 0,
    unique: true
  },
  customer_name: {
    type: String,
    required: true
  },
  customer_phone: {
    type: String,
    required: true
  },
  items_name: [{
    prodcut: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      required: true
    },
    Unit_price: {
      type: Number,
      required: true
    },
  }],
  totla_Price: {
    type: Number,
  },

  cashier: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
  },
  shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shops',
  },
  date: {
    type: Date,
    default: Date.now()
  },


})
autoIncrement.initialize(mongoose.connection)
shopInvoiceSchema.plugin(autoIncrement.plugin, {
  model: 'Customers_Invoices',
  field: 'Invoice_number',
  startAt: 1,
  incrementBy: 1
});
module.exports = mongoose.model('Customers_Invoices', shopInvoiceSchema, 'Customers_Invoices');

