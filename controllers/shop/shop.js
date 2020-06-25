const vendorModel = require('../../models/dealings/vendor')
const shopModel = require('../../models/dealings/shop')
const invoiceVendorModel = require('../../models/invoices/vendor_invoice')
const invoiceShopModel = require('../../models/invoices/shop_invoice')
const invoiceCustomerModel = require('../../models/invoices/customer_invoice')
const accountModel = require('../../models/finance/account')
const myDeptModel = require('../../models/finance/my_dept')
const productModel = require('../../models/products/product')
const repositoryModel = require('../../models/repository')
const colorModel = require('../../models/products/color')
const sizeModel = require('../../models/products/size')
const categoryModel = require('../../models/products/category')
const userModel = require('../../models/user')
const repository = require('../../models/repository')



// add new Shop 
exports.addShop = async (req, res, next) => {
  try {
    const shop = await shopModel.findOne({ shopName: req.body.shopName })
    console.log(shop)
    console.log(req.body.shopName)
    if (shop) {
      return res.status(403).json({ message: 'Shop exists !!' })
    }
    const newShop = new shopModel({
      shopName: req.body.shopName,
      phoneNumber: req.body.phoneNumber
    })
    await newShop.save();
    const shopRepo = await repositoryModel.findOne({ shop: newShop.id })
    let newRepo
    if (!shopRepo) {
      newRepo = new repositoryModel({
        shop: newShop.id
      })
      await newRepo.save();
    }
    res.status(201).json({ newShop, newRepo })
  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}

exports.cashirSales = (req, res, next) => {

}
// get all user invoice 
exports.getCashierInvoices = async (req, res, next) => {
  try {
    const cashier = req.user._id
    const invoices = await invoiceCustomerModel.find({ cashier })
    // console.log(invoices[0, 1, 2])
    if (invoices.length <= 0) {
      return res.status(200).json({ message: 'no invoices for this cashier!!' })
    }
    return res.status(200).json({ invoices })

  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}

exports.shopCashiers = async (req, res, next) => {
  try {

    const shopId = req.params.shopId
    const cashiers = await userModel.find({ shop: shopId })
    if (!cashiers) {
      return res.status(403).json({ message: 'cashiers not found !!' })
    }
    if (cashiers.length <= 0) {
      return res.status(200).json({ message: 'No Cashiers for this shop!!' })
    }
    res.status(200).json({ cashiers })
  } catch (error) {
    console.log(error)
    res.json({ error })
  }


}
// =========================================
exports.getShopInvoices = (req, res, next) => {
}
// =============================================
exports.getAllShop = async (req, res, next) => {
  try {
    const shops = await repositoryModel.find().populate('shop.name')
    console.log(shops)
    res.json({ shops })
    let shopsName

  } catch (error) {

  }

}