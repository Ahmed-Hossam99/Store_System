const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const deptSchema = new Schema({

  name: {
    type: Schema.Types.ObjectId,
    ref: 'Companies'
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
module.exports = mongoose.model('outerDept', deptSchema, 'outerDept');