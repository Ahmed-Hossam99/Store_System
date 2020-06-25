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


exports.getAllVendor = async (req, res, next) => {
  try {
    const vendors = await vendorModel.find()
    if (vendors.length <= 0) {
      return res.status(200).json({ message: 'No Vendor Added !!' })
    }


    res.status(200).json({ vendors })

  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}

exports.getSingleVendor = async (req, res, next) => {
  try {
    const vendorId = req.params.vendorId
    const vendor = await vendorModel.findById({ _id: vendorId })
    const vendorPurchaseInvoices = await invoiceVendorModel.find({ vendor_name: vendorId })
    const vendorDeptInvoices = await myDeptModel.find({ name: vendorId })
    let totalPurchase = 0
    vendorPurchaseInvoices.forEach(item => {
      totalPurchase += item.totla_Price
    });
    let totalDept = 0
    vendorDeptInvoices.forEach(item => {
      totalDept += item.remainder
    });

    res.status(200).json({ vendor, purchase: { vendorPurchaseInvoices, purchase: { totalPurchase } }, Dept: { vendorDeptInvoices, total: { totalDept } } })

  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}