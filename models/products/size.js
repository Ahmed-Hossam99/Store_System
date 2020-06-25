
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sizeSchema = new Schema({

  size: String    //string to xl and 52 .....
});

module.exports = mongoose.model('Size', sizeSchema);
