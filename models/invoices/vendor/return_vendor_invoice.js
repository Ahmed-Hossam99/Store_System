const mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

const vendorReturnInvoiceSchema = new Schema({
  Invoice_type: {
    type: String,
    default: ' Return invoice',
  },
  Invoice_number: {
    type: Number,
    default: 0,
    unique: true
  },
  vendor_name: {
    type: String,
    required: true
  },
  vendor_phone: {
    type: String,
    // required: true
  },
  nationalId: {
    type: String,
    required: true
  },
  notes: {
    type: String,
  },
  salesInvoice: {
    type: String,
    type: Schema.Types.ObjectId,
    ref: 'Shops_Invoices'
  },
  return_goods: [{
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
  toal_quantity: {
    type: Number,
  },

  totla_Price: {
    type: Number,
  },
  sales_invoice_number: {
    type: Number,
  },

}, { timestamps: true })
autoIncrement.initialize(mongoose.connection)
vendorReturnInvoiceSchema.plugin(autoIncrement.plugin, {
  model: 'Vendor_Return_Invoices',
  field: 'Invoice_number',
  startAt: 1,
  incrementBy: 1
});
module.exports = mongoose.model('Vendor_Return_Invoices', vendorReturnInvoiceSchema, 'Vendor_Return_Invoices');

