
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const repositorySchema = new Schema({
  shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shops',
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }]

});

module.exports = mongoose.model('Repository', repositorySchema, 'Repository');