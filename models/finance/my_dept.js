const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const deptSchema = new Schema({
  salesInvoice: {
    type: String,
  },
  name: {
    type: String,
    required: true
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
  Paid_debt: {
    type: String,
    enum: ['true', 'false'],
    default: 'false'
  },
  date: {
    type: Date,
    default: Date.now()
  }
})
module.exports = mongoose.model('myDept', deptSchema, 'myDept');