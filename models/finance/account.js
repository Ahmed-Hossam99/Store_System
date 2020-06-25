const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const accountSchema = new Schema({
  // الرصيد الحالي 
  current_balance: {
    type: Number
  },
  // اجمالي الديون اللي ليا 
  Total_my_debt: {
    type: Number
  },
  // اجمالي الديون اللي عليا 
  Total_outer_debt: {
    type: Number
  }

})

module.exports = mongoose.model('Accounts', accountSchema, 'Accounts');