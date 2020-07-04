
const shopModel = require('../../models/dealings/shop')
const invoiceShopModel = require('../../models/invoices/shop/shop_invoice')
const invoiceShopReturnModel = require('../../models/invoices/shop/return_shop_invoice')
const invoiceCustomerModel = require('../../models/invoices/customer/customer_invoice')
const invoiceReturnModel = require('../../models/invoices/customer/return_invoice')
const myDeptModel = require('../../models/finance/my_dept')
const repositoryModel = require('../../models/shopRepository/repository')
const colorModel = require('../../models/products/color')
const sizeModel = require('../../models/products/size')
const categoryModel = require('../../models/products/category')
const userModel = require('../../models/user')
const _ = require('lodash')
// let key = _.findKey(shopRepo.products,_.matchesProperty('barcode',req.body.barcode))
//  shopRepo.products[key]



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

// get all user invoice 
exports.getCashierInvoices = async (req, res, next) => {
  try {
    const cashier = req.user._id
    const invoices = await invoiceCustomerModel.find({ cashier, hasReturn: 'No' })
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
exports.getShopInvoices = async (req, res, next) => {
  try {
    const invoices = await invoiceCustomerModel.find({ shop: req.user.shop, hasReturn: 'No' })
    if (invoices.length <= 0) {
      return res.status(200).json({ message: 'no invoice for this shop' })
    }
    let total = 0
    invoices.forEach(item => {
      total += item.totla_Price
    });
    res.status(200).json({ invoices, total })
  } catch (error) {
    console.log(error)
    res.json(error)
  }
}
// =============================================
exports.getAllShop = async (req, res, next) => {
  try {
    const shops = await repositoryModel.find().populate('shop')
    console.log(shops)
    res.json({ shops })
    let shopsName

  } catch (error) {

  }

}

exports.addShopProduct = async (req, res, next) => {
  try {
    const color = await colorModel.findOne({ name: req.body.color })
    let newColor
    if (!color) {
      newColor = new colorModel({
        name: req.body.color
      })
      await newColor.save();
      console.log(newColor)
    }
    const size = await sizeModel.findOne({ size: req.body.size })
    let newSize
    if (!size) {
      newSize = new sizeModel({
        size: req.body.size
      })
      await newSize.save();
      console.log(newSize)
    }
    const category = await categoryModel.findOne({ name: req.body.category })
    let newCategory
    if (!category) {
      newCategory = new categoryModel({
        name: req.body.category
      })
      await newCategory.save();
      console.log(newCategory)
    }
    // ============================================
    const newProduct = {
      barCode: req.body.barCode,
      name: req.body.name,
      description: req.body.description,
      avaliableQuantity: req.body.avaliableQuantity,
      purchase_price: req.body.purchase_price,
      sales_price: req.body.sales_price,
      size: size === undefined ? newSize.id : size._id,
      color: color === undefined ? newColor.id : color._id,
      category: category === undefined ? newCategory.id : category._id
    }



    const shopRepo = await repositoryModel.findOne({ shop: req.user.shop })
    // console.log(shopRepo)
    let key = _.findKey(shopRepo.products, _.matchesProperty('barCode', req.body.barCode))
    let existProduct = shopRepo.products[key]
    console.log(shopRepo.products[key])
    if (existProduct) {
      existProduct.avaliableQuantity += req.body.avaliableQuantity
      await shopRepo.save();
      return res.status(201).json({ existProduct, message: 'product updated' })
    }
    await shopRepo.products.push(newProduct)
    await shopRepo.save();
    res.status(201).json(shopRepo)

  } catch (error) {
    console.log(error)
    res.json({ error })
  }

}


exports.getShopProducts = async (req, res, next) => {
  try {
    const cashierShop = await repositoryModel.findOne({ shop: req.user.shop })
    if (cashierShop.products.length <= 0) {
      return res.status(200).json({ message: 'No product for this shop!!' })
    }
    res.status(200).json(cashierShop.products)

  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}

exports.salesProducts = async (req, res, next) => {
  try {
    let goods = []
    let total = 0
    const shopRepo = await repositoryModel.findOne({ shop: req.user.shop })
    let len = req.body.items_name
    for (let i = 0; i < len.length; i++) {
      let key = _.findKey(shopRepo.products, _.matchesProperty('barCode', len[i].barCode))
      if (!shopRepo.products[key]) {

        return res.status(422).json({ message: 'product not found!!' })
      }
      if (shopRepo.products[key].avaliableQuantity < len[i].quantity || shopRepo.products[key].avaliableQuantity < 1) {
        let product = shopRepo.products[key].name
        return res.status(422).json({ product, message: 'Avaliable Quantity not enough!!' })
      }
      // console.log(shopRepo.products[key])
      len[i].prodcut = shopRepo.products[key].name
      quantity = len[i].quantity === undefined ? 1 : len[i].quantity
      console.log(len[i].quantity)
      len[i].Unit_price = shopRepo.products[key].sales_price
      total += quantity * len[i].Unit_price
      shopRepo.products[key].avaliableQuantity -= quantity
      console.log(shopRepo.products[key].avaliableQuantity)
      goods.push(len[i])
      await shopRepo.save()
    }
    // console.log(shopRepo.products[key].avaliableQuantity)
    const customerInvoice = new invoiceCustomerModel({
      Invoice_type: req.body.Invoice_type,
      customer_name: req.body.customer_name,
      customer_phone: req.body.customer_phone,
      items_name: goods,
      totla_Price: total,
      cashier: req.user._id,
      shop: req.user.shop,
      date: Date.now()
    })
    await customerInvoice.save()
    res.status(201).json({ customerInvoice })



    // console.log(shopRepo.products[key])
  } catch (error) {
    console.log(error)
    res.json(error)
  }
}

exports.getcashier = async (req, res, next) => {
  try {

    const cashierId = req.params.cashierId
    const cashierData = await userModel.findById({ _id: cashierId }).populate('shop')
    const cashierInvoices = await invoiceCustomerModel.find({ cashier: cashierId })
    let total = 0
    cashierInvoices.forEach(items => {
      // console.log(items.totla_Price)
      total += items.totla_Price
      // console.log(total)
    })
    res.status(200).json({ cashierData, invoices: { cashierInvoices, total_sales: { total } } })
  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}

exports.ShopInvoicesAdmin = async (req, res, next) => {
  try {
    const shopId = req.params.shopId
    const invoices = await invoiceCustomerModel.find({ shop: shopId, hasReturn: 'No' })

    if (invoices.length <= 0) {
      return res.status(200).json({ message: 'No invoices for this shop!!' })
    }
    let total = 0
    invoices.forEach(item => {
      total += item.totla_Price
    })
    res.status(200).json({ invoices, total_Sales: { total } })
  } catch (error) {
    console.log(error)
    res.json({ error })
  }


}

exports.returnProduct = async (req, res, next) => {
  try {
    const mainInvoice = await invoiceCustomerModel.findOne({ Invoice_number: req.body.Invoice_number })
    console.log(mainInvoice)
    if (mainInvoice.shop.toString() != req.user.shop.toString()) {
      console.log(mainInvoice.shop)
      console.log(req.user.shop)
      return res.status(403).json({ message: 'not allow this invoice from another depart !!' })
    }
    let returnGoods = []
    let finalGoods = []
    finalTotal = 0
    let total = 0
    let len = req.body.items_name
    let product = mainInvoice.items_name
    let fin = mainInvoice.items_name.length
    for (let j = 0; j < len.length; j++) {
      // to ensure that incomming barCode or product is in this invoice
      for (let i = 0; i < product.length; i++) {
        if (product[i].barCode === len[j].barCode) {
          if (product[i].quantity < len[j].quantity) {
            return res.status(422).json({ inProduct: len[j], message: 'This qunatity much larger than saled quantity!!' })
          }
          len[j].prodcut = product[i].prodcut
          quantity = len[j].quantity === undefined ? 1 : len[j].quantity
          len[j].Unit_price = product[i].Unit_price
          returnGoods.push(len[j])
          product[i].quantity -= len[j].quantity
          finalGoods.push(product[i])
        }
      }
    }
    // save invoice as has return 
    const salseInvoice = await invoiceCustomerModel.findOne({ Invoice_number: req.body.Invoice_number })
    salseInvoice.hasReturn = 'Yes'
    await salseInvoice.save();
    // return product to the store 
    const shopRepo = await repositoryModel.findOne({ shop: req.user.shop })
    for (let i = 0; i < returnGoods.length; i++) {
      let key = _.findKey(shopRepo.products, _.matchesProperty('barCode', returnGoods[i].barCode))
      shopRepo.products[key].avaliableQuantity += quantity
      total += returnGoods[i].Unit_price * returnGoods[i].quantity
    }
    await shopRepo.save();
    // make new invoice to customer 
    finalTotal = mainInvoice.totla_Price - total
    const fianlInvoice = new invoiceCustomerModel({
      Invoice_type: 'sales invoice',
      customer_name: mainInvoice.customer_name,
      customer_phone: mainInvoice.customer_phone,
      items_name: finalGoods,
      totla_Price: finalTotal,
      cashier: req.user._id,
      shop: req.user.shop,
      date: Date.now()
    })
    await fianlInvoice.save();
    // make new return invoice 
    const returnInvoice = new invoiceReturnModel({
      Invoice_type: req.body.Invoice_type,
      customer_name: req.body.customer_name,
      customer_phone: req.body.customer_phone,
      items_name: returnGoods,
      totla_Price: total,
      cashier: req.user._id,
      shop: req.user.shop,
      date: Date.now()
    })
    await returnInvoice.save();

    res.status(201).json({ returnInvoice, fianlInvoice })
  } catch (error) {
    console.log(error)
    res.json(error)

  }
}

exports.getInvoiceHasReturn = async (req, res, next) => {
  try {
    const hasReturnInvoices = await invoiceCustomerModel.find({ hasReturn: 'Yes' })
    if (hasReturnInvoices.length <= 0) {
      return res.status(200).json({ message: 'not return invoices for this shop' })

    }
    res.status(200).json({ hasReturnInvoices })

  } catch (error) {
    console.log(error)
    res.json({ error })
  }

}


exports.getShopInvoiceHasReturn = async (req, res, next) => {
  try {
    const shopId = req.params.shopId
    const hasReturnInvoices = await invoiceCustomerModel.find({ shop: shopId, hasReturn: 'Yes' })
    if (hasReturnInvoices.length <= 0) {
      return res.status(200).json({ message: 'not return invoices for this shop' })

    }
    res.status(200).json({ hasReturnInvoices })

  } catch (error) {
    console.log(error)
    res.json({ error })
  }

}


exports.getShopPurchaseAndReturnInvoices = async (req, res, next) => {
  try {
    const shopPurchaseInvoice = await invoiceShopModel.findOne({ Invoice_number: req.body.Invoice_number, hasReturn: 'Yes' })
    if (!shopPurchaseInvoice) {
      return res.status(404).json({ message: 'this invoices not found ' })
    }
    let invoiceNumber = shopPurchaseInvoice.Invoice_number
    const shopReturnInvoice = await invoiceShopReturnModel.findOne({ sales_invoice_number: invoiceNumber })
    if (!shopReturnInvoice) {
      return res.status(403).json({ message: 'this invoices not have any return ' })
    }
    res.status(200).json({ shopReturnInvoice, shopPurchaseInvoice })
  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}


exports.getShopPurchaseAndDeptInvoices = async (req, res, next) => {
  try {
    const shopPurchaseInvoice = await invoiceShopModel.findOne({ Invoice_number: req.body.Invoice_number, hasReminder: 'Yes', hasReturn: 'No' })
    console.log(shopPurchaseInvoice)
    if (!shopPurchaseInvoice) {
      return res.status(404).json({ message: 'this invoices not found ' })
    }
    let invoiceNumberId = shopPurchaseInvoice._id
    const shopDeptInvoice = await myDeptModel.findOne({ salesInvoice: invoiceNumberId, Paid_debt: 'false' })
    if (!shopDeptInvoice) {
      return res.status(403).json({ message: 'this invoices not have any dept ' })
    }
    res.status(200).json({ shopPurchaseInvoice, shopDeptInvoice })
  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}

exports.getShopDeptInvoices = async (req, res, next) => {
  try {
    const shopId = req.params.shopId
    const shop = await shopModel.findById({ _id: shopId })
    const shopDeptInvoices = await myDeptModel.find({ name: shopId, Paid_debt: 'false' })
    if (shopDeptInvoices.length <= 0) {
      return res.status(200).json({ message: 'this vendor not have any dept invoices ' })
    }
    let totalDept = 0
    shopDeptInvoices.forEach(item => {
      totalDept += item.totla_Price
    });

    res.status(200).json({ shopDeptInvoices, totalDept })

  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}

exports.getShopDeptPaiedInvoices = async (req, res, next) => {
  try {
    const shopId = req.params.shopId
    const shop = await shopModel.findById({ _id: shopId })
    const shopDeptInvoices = await myDeptModel.find({ name: shopId, Paid_debt: 'true' })
    if (shopDeptInvoices.length <= 0) {
      return res.status(200).json({ message: 'this vendor not have any dept invoices ' })
    }
    let totalDept = 0
    shopDeptInvoices.forEach(item => {
      totalDept += item.totla_Price
    });

    res.status(200).json({ shopDeptInvoices, totalDept })

  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}
