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
  shop_name: {
    type: String,
    required: true
  },
  shop_phone: {
    type: String,
    required: true
  },
  exported_goods: [{
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
    },
    total: {
      type: Number,
    },

  }],
  imported_quantity: {
    type: String,
  },

  totla_Price: {
    type: Number,
  },
  paid: {
    type: Number,
    required: true
  },
  remainder: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now()
  },


})
autoIncrement.initialize(mongoose.connection)
shopInvoiceSchema.plugin(autoIncrement.plugin, {
  model: 'Shops_Invoices',
  field: 'Invoice_number',
  startAt: 1,
  incrementBy: 1
});
module.exports = mongoose.model('Shops_Invoices', shopInvoiceSchema, 'Shops_Invoices');

