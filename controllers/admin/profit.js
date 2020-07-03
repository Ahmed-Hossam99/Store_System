const vendorModel = require('../../models/dealings/vendor')
const shopModel = require('../../models/dealings/shop')
const invoiceVendorModel = require('../../models/invoices/vendor_invoice')
const invoiceReturnVendorModel = require('../../models/invoices/vendor/return_vendor_invoice')
const invoiceShopModel = require('../../models/invoices/shop_invoice')
const invoiceReturnShopModel = require('../../models/invoices/shop/return_shop_invoice')
const accountModel = require('../../models/finance/account')
const myDeptModel = require('../../models/finance/my_dept')
const productModel = require('../../models/products/product')
const colorModel = require('../../models/products/color')
const sizeModel = require('../../models/products/size')
const categoryModel = require('../../models/products/category')
const product = require('../../models/products/product')
const { first } = require('lodash')
const moment = require('moment')


// let start = new Date(now.getFullYear(),now.getMonth(),now.getDate(),1,0,0);

//   let end = new Date(now.getFullYear(),now.getMonth(),now.getDate()+1,0,59,59);

//   let query = {createdAt: {$gte: start, $lt: end} };

//   Account
//   .find(query)
//   .exec((err, accounts) => console.log(account) )



exports.getInventory = async (req, res, next) => {
  try {
    var start = new Date('2020-06-24T07:26:27.883+00:00');
    // end today
    var end = new Date('2020-06-30T13:03:20.860+00:00');


    const vendorSales = await invoiceVendorModel.find({ date: { '$gte': start, '$lt': end } })
    const shopSales = await invoiceShopModel.find({ date: { '$gte': start, '$lt': end } })
    console.log(shopSales)

  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}





