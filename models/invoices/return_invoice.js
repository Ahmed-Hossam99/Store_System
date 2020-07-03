const mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

const returnInvoiceSchema = new Schema({
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
    barCode: {
      type: String,
    },
    prodcut: {
      type: String,
    },
    quantity: {
      type: Number,
      default: 1,
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
returnInvoiceSchema.plugin(autoIncrement.plugin, {
  model: 'Customers_Invoices',
  field: 'Invoice_number',
  startAt: 1,
  incrementBy: 1
});
module.exports = mongoose.model('Return_Invoices', returnInvoiceSchema, 'Return_Invoices');

