const vendorModel = require('../../models/dealings/vendor')
const shopModel = require('../../models/dealings/shop')
const invoiceVendorModel = require('../../models/invoices/vendor_invoice')
const invoiceShopModel = require('../../models/invoices/shop_invoice')
const accountModel = require('../../models/finance/account')
const myDeptModel = require('../../models/finance/my_dept')
const productModel = require('../../models/products/product')
const colorModel = require('../../models/products/color')
const sizeModel = require('../../models/products/size')
const categoryModel = require('../../models/products/category')
const product = require('../../models/products/product')


exports.exportedProductShop = async (req, res, next) => {
  try {
    let total = 0
    let quantity = 0
    let goods = []

    const len = req.body.exported_goods
    for (let i = 0; i < len.length; i++) {
      products = await productModel.findById(len[i].prodcut)
      console.log(products)
      if (products) {
        if (products.avaliableQuantity < len[i].quantity) {
          return res.status(422).json({ product: { productName: products.name, qty: products.avaliableQuantity }, message: 'Avaliable Quantity Not Enught!!' })
        }
      }
      products.avaliableQuantity -= len[i].quantity
      await products.save()
      // ==========================
      len[i].Unit_price = products.sales_price
      console.log(len[i].Unit_price)
      len[i].total = len[i].quantity * len[i].Unit_price
      console.log(len[i].total)
      total += len[i].total
      quantity += len[i].quantity
      goods.push(len[i])

    }
    const shop = await shopModel.findOne({ name: req.body.shop_name })
    let newShop
    if (!shop) {
      newShop = new shopModel({
        shopName: req.body.shop_name,
        phoneNumber: req.body.shop_phone,
      })
      await newShop.save();
    }

    // ====================================================
    // store shop invoice   
    const shopInvoice = new invoiceShopModel({
      Invoice_type: req.body.Invoice_type,
      shop_name: newShop === undefined ? shop._id : newShop.id,
      shop_phone: req.body.shop_phone,
      exported_goods: goods,
      imported_quantity: quantity,
      totla_Price: total,
      paid: req.body.paid,
      remainder: req.body.paid < total ? total - req.body.paid : 0,
      date: Date.now()
    })
    if (req.body.paid > total) {
      return res.status(422).json({
        message: ' wrong date on paid!!'
      })
    }
    await shopInvoice.save();
    // =====================================================
    // create dept if exist 
    let newDept
    if (req.body.paid < total) {
      newDept = new myDeptModel({
        name: shopInvoice.shop_name,
        totla_Price: total,
        paid: req.body.paid,
        remainder: total - req.body.paid,
        date: Date.now()
      })
      await newDept.save()
    }
    // ==============================================================================
    // account edit 
    const account = await accountModel.findOne({ _id: '5ef07dccc88fe5194456dc25' })
    console.log(account)
    if (req.body.paid < total) {
      account.Total_my_debt += total - req.body.paid
    }
    account.current_balance += req.body.paid
    await account.save();
    console.log('=======================================')
    console.log(account.current_balance)
    console.log(account.Total_my_debt)
    // =====================================================================
    //  add vendor if new 

    res.status(201).json({ shopInvoice, newShop, newDept })
  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}

exports.exportedProductTader = async (req, res, next) => {
  try {
    let total = 0
    let quantity = 0
    let goods = []

    const len = req.body.exported_goods
    for (let i = 0; i < len.length; i++) {
      products = await productModel.findById(len[i].prodcut)
      // console.log(products)
      if (products) {
        if (products.avaliableQuantity < len[i].quantity) {
          return res.status(422).json({ product: { productName: products.name, qty: products.avaliableQuantity }, message: 'Avaliable Quantity Not Enught!!' })
        }
      }
      products.avaliableQuantity -= len[i].quantity
      await products.save()
      // ==========================
      len[i].Unit_price = products.sales_price
      console.log(len[i].Unit_price)
      len[i].total = len[i].quantity * len[i].Unit_price
      console.log(len[i].total)
      total += len[i].total
      quantity += len[i].quantity
      goods.push(len[i])

    }

    //  add vendor if new 
    const vendor = await vendorModel.findOne({ nationalId: req.body.nationalId })
    // console.log(vendor)
    console.log(req.body.vendor_name)
    let newVendor
    if (!vendor) {
      newVendor = new vendorModel({
        name: req.body.vendor_name,
        phoneNumber: req.body.vendor_phone,
        nationalId: req.body.nationalId
      })
      await newVendor.save();
      console.log(newVendor)

    }
    // console.log(goods)
    const vendorInvoice = new invoiceVendorModel({
      Invoice_type: req.body.Invoice_type,
      vendor_name: newVendor === undefined ? vendor._id : newVendor.id,
      nationalId: req.body.nationalId,
      vendor_phone: req.body.vendor_phone,
      exported_goods: goods,
      imported_quantity: quantity,
      totla_Price: total,
      paid: req.body.paid,
      remainder: req.body.paid < total ? total - req.body.paid : 0,
      date: Date.now()
    })

    if (req.body.paid > total) {
      return res.status(422).json({
        message: ' wrong date on paid!!'
      })
    }
    await vendorInvoice.save();
    // ====================================
    // create dept if exist 
    let newDept
    if (req.body.paid < total) {
      newDept = new myDeptModel({
        name: vendorInvoice.vendor_name,
        totla_Price: total,
        paid: req.body.paid,
        remainder: total - req.body.paid,
        date: Date.now()
      })
      await newDept.save()
    }
    // ==============================================================================
    // account edit 
    const account = await accountModel.findOne({ _id: '5ef07dccc88fe5194456dc25' })
    console.log(account)
    if (req.body.paid < total) {
      account.Total_my_debt += total - req.body.paid
    }
    account.current_balance += req.body.paid
    await account.save();
    console.log('=======================================')
    console.log(account.current_balance)
    console.log(account.Total_my_debt)
    // //  add vendor if new 
    // const vendor = await vendorModel.findOne({ nationalId: req.body.nationalId })
    // let newVendor
    // if (!vendor) {
    //   newVendor = new vendorModel({
    //     name: req.body.vendor_name,
    //     phoneNumber: req.body.vendor_phone,
    //     nationalId: req.body.nationalId
    //   })
    //   await newVendor.save();
    // }
    res.status(201).json({ vendorInvoice, newVendor, newDept })

  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}

