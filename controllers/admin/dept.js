const invoiceVendorModel = require('../../models/invoices/vendor/vendor_invoice')
const invoiceShopModel = require('../../models/invoices/shop/shop_invoice')
const myDeptModel = require('../../models/finance/my_dept')

const { first } = require('lodash')


exports.paiedVendorDept = async (req, res, next) => {
  try {
    invoiceId = req.params.invoiceId
    const vendorDept = await myDeptModel.findById({ _id: invoiceId })
    vendorDept.Paid_debt = 'true'
    const mainInvoice = await invoiceVendorModel.findById({ _id: vendorDept.salesInvoice })
    mainInvoice.hasReminder = 'No'
    await vendorDept.save();
    await mainInvoice.save();
    res.status(200).json({ vendorDept, mainInvoice })
  } catch (error) {
    console.log(error)
    res.json({ error })
  }

}

exports.paiedShopDept = async (req, res, next) => {
  try {
    invoiceId = req.params.invoiceId
    const shopDept = await myDeptModel.findById({ _id: invoiceId })
    shopDept.Paid_debt = 'true'
    const mainInvoice = await invoiceShopModel.findById({ _id: shopDept.salesInvoice })
    mainInvoice.hasReminder = 'No'
    await shopDept.save();
    await mainInvoice.save();
    res.status(200).json({ shopDept, mainInvoice })
  } catch (error) {
    console.log(error)
    res.json({ error })
  }

}