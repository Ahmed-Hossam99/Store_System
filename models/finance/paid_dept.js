const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const deptSchema = new Schema({

  name: {
    type: String
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
  remainder: {
    type: Number,
  },
  Paid_debt: {
    type: String,
    enum: ['true', 'false'],
    default: 'false'
  },
  date: {
    type: Date
  }
})
module.exports = mongoose.model('paidDept', deptSchema, 'outerDept');