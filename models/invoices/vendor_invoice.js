const mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

const vendorInvoiceSchema = new Schema({
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
  vendor_name: {
    type: Schema.Types.ObjectId,
    ref: 'Vendors',
    required: true
  },
  vendor_phone: {
    type: String,
    required: true
  },
  nationalId: {
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
vendorInvoiceSchema.plugin(autoIncrement.plugin, {
  model: 'Vendors_Invoices',
  field: 'Invoice_number',
  startAt: 1,
  incrementBy: 1
});
module.exports = mongoose.model('Vendors_Invoices', vendorInvoiceSchema, 'Vendors_Invoices');

