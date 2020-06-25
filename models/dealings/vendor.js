const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vendorSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,

  },
  nationalId: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('Vendors', vendorSchema, 'Vendors');