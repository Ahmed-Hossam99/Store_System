const vendorModel = require('../../models/dealings/vendor')
const shopModel = require('../../models/dealings/shop')
const invoiceVendorModel = require('../../models/invoices/vendor_invoice')
const invoiceReturnVendorModel = require('../../models/invoices/vendor/return_vendor_invoice')
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
    res.status(200).json({ vendor })

  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}


exports.getVendorSalesInvoices = async (req, res, next) => {
  try {
    const vendorId = req.params.vendorId
    const vendor = await vendorModel.findById({ _id: vendorId })
    const vendorPurchaseInvoices = await invoiceVendorModel.find({ vendor_name: vendorId, hasReturn: 'No' })
    if (vendorPurchaseInvoices.length <= 0) {
      return res.status(200).json({ message: 'this vendor not have any invoices ' })
    }
    let totalPurchase = 0
    vendorPurchaseInvoices.forEach(item => {
      totalPurchase += item.totla_Price
    });

    res.status(200).json({ vendorPurchaseInvoices, totalPurchase })

  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}


exports.getVendorDeptInvoices = async (req, res, next) => {
  try {
    const vendorId = req.params.vendorId
    const vendor = await vendorModel.findById({ _id: vendorId })
    console.log(vendor.name)
    const vendorDeptInvoices = await myDeptModel.find({ name: vendorId, Paid_debt: 'false' })
    if (vendorDeptInvoices.length <= 0) {
      return res.status(200).json({ message: 'this vendor not have any dept invoices ' })
    }
    let totalDept = 0
    vendorDeptInvoices.forEach(item => {
      totalDept += item.totla_Price
    });

    res.status(200).json({ vendorDeptInvoices, totalDept })

  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}


exports.getVendorReturnInvoices = async (req, res, next) => {
  try {
    const vendorId = req.params.vendorId
    const vendor = await vendorModel.findById({ _id: vendorId })
    const vendorPurchaseInvoices = await invoiceReturnVendorModel.find({ vendor_name: vendorId })
    if (vendorPurchaseInvoices.length <= 0) {
      return res.status(200).json({ message: 'this vendor not have any invoices ' })
    }
    let totalPurchase = 0
    vendorPurchaseInvoices.forEach(item => {
      totalPurchase += item.totla_Price
    });

    res.status(200).json({ vendorPurchaseInvoices, totalPurchase })

  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}


exports.getVendorPurchaseAndReturnInvoices = async (req, res, next) => {
  try {
    const vendorPurchaseInvoice = await invoiceVendorModel.findOne({ Invoice_number: req.body.Invoice_number, hasReturn: 'Yes' })
    if (!vendorPurchaseInvoice) {
      return res.status(404).json({ message: 'this invoices not found ' })
    }
    let invoiceNumber = vendorPurchaseInvoice.Invoice_number
    const vendorReturnInvoice = await invoiceReturnVendorModel.findOne({ sales_invoice_number: invoiceNumber })
    if (!vendorReturnInvoice) {
      return res.status(403).json({ message: 'this invoices not have any return ' })
    }
    res.status(200).json({ vendorReturnInvoice, vendorPurchaseInvoice })
  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}


exports.getVendorPurchaseAndDeptInvoices = async (req, res, next) => {
  try {
    const vendorPurchaseInvoice = await invoiceVendorModel.findOne({ Invoice_number: req.body.Invoice_number, hasReminder: 'Yes', hasReturn: 'No' })
    if (!vendorPurchaseInvoice) {
      return res.status(404).json({ message: 'this invoices not found ' })
    }
    let invoiceNumberId = vendorPurchaseInvoice._id
    const vendorDeptInvoice = await myDeptModel.findOne({ salesInvoice: invoiceNumberId, Paid_debt: 'No' })
    if (!vendorDeptInvoice) {
      return res.status(403).json({ message: 'this invoices not have any dept ' })
    }
    res.status(200).json({ vendorPurchaseInvoice, vendorDeptInvoice })
  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}