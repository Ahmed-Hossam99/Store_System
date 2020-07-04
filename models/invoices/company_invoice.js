const mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

const companyInvoiceSchema = new Schema({
  // خاصه ب الادمن حين الاستيراد 
  Invoice_type: {
    type: String,
    enum: ['Purchase invoice', ' Return invoice'],
    required: true
  },
  Invoice_number: {
    type: Number,
    default: 0,
    unique: true
  },
  company_name: {
    type: Schema.Types.ObjectId,
    ref: 'Companies',
  },
  company_phone: {
    type: String,
    required: true
  },
  company_number: {
    type: Number,
    required: true
  },
  imported_goods: [{
    prodcut: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    Unit_price: {
      type: Number,
      required: true
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

  hasReturn: {
    type: String,
    enum: ['No', 'Yes'],
    default: 'No',

  },


}, { timestamps: true })
autoIncrement.initialize(mongoose.connection)
companyInvoiceSchema.plugin(autoIncrement.plugin, {
  model: 'Companies_Invoices',
  field: 'Invoice_number',
  startAt: 1,
  incrementBy: 1
});
module.exports = mongoose.model('Companies_Invoices', companyInvoiceSchema, 'Companies_Invoices');

