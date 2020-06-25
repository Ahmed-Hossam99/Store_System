const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
  companyName: {
    type: String,
    required: true
  },
  companyNumber: {
    type: Number,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,

  }
})

module.exports = mongoose.model('Companies', companySchema, 'Companies');