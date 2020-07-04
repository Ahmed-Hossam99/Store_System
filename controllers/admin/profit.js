
const invoiceVendorModel = require('../../models/invoices/vendor/vendor_invoice')
const invoiceShopModel = require('../../models/invoices/shop/shop_invoice')
const { first } = require('lodash')


exports.getInventory = async (req, res, next) => {
  try {
    const startDate = req.params.startDate
    const endDate = req.params.endDate
    let matchQuery = { hasReturn: 'No' }
    if (startDate) {
      matchQuery.createdAt = { $gte: (startDate) }
    }
    if (endDate) {
      matchQuery.createdAt = {
        ...matchQuery.createdAt,
        $lte: (endDate),
      }
    }
    console.log(matchQuery)

    const shopSales = await invoiceShopModel.find(matchQuery)
    const vendorSales = await invoiceVendorModel.find(matchQuery)
    totalSalesMony = 0
    totalProductSales = 0
    // console.log(shopSales)
    shopSales.forEach(item => {
      totalProductSales += item.imported_quantity
      totalSalesMony += item.totla_Price

    });
    vendorSales.forEach(item => {
      totalProductSales += item.imported_quantity
      totalSalesMony += item.totla_Price

    });
    res.status(200).json({ shopSales, vendorSales, salesMony: totalSalesMony, salesProduct: totalProductSales })
  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}
exports.getProfit = async (req, res, next) => {
  try {
    const startDate = req.params.startDate
    const endDate = req.params.endDate
    let matchQuery = {}
    if (startDate) {
      matchQuery.createdAt = { $gte: (startDate) }
    }
    if (endDate) {
      matchQuery.createdAt = {
        ...matchQuery.createdAt,
        $lte: (endDate),
      }
    }
    console.log(matchQuery)
    const shopSales = await invoiceShopModel.find(matchQuery)
    const vendorSales = await invoiceVendorModel.find(matchQuery)
    let totalSalesMony = 0
    let totalProductSales = 0
    let totalSalesQty = 0
    let totalProfit = 0
    let totalPurshasePrice = 0
    let totalSalesPrice = 0
    let product
    for (let j = 0; j < shopSales.length; j++) {
      let goods = shopSales[j]
      // inventory
      totalProductSales += goods.imported_quantity
      totalSalesMony += goods.totla_Price

      // profit 
      for (let i = 0; i < goods.exported_goods.length; i++) {
        let item = goods.exported_goods[i]
        product = await productModel.findById({ _id: item.prodcut })
        product.purchase_price
        totalSalesQty = item.quantity
        totalPurshasePrice += product.purchase_price * totalSalesQty
        totalSalesPrice += product.sales_price * totalSalesQty
      }
    }
    for (let j = 0; j < vendorSales.length; j++) {
      let goods = shopSales[j]
      // inventory
      totalProductSales += goods.imported_quantity
      totalSalesMony += goods.totla_Price
      // profit 
      for (let i = 0; i < goods.exported_goods.length; i++) {
        let item = goods.exported_goods[i]
        product = await productModel.findById({ _id: item.prodcut })
        totalSalesQty = item.quantity
        // console.log(product.purchase_price)
        totalPurshasePrice = totalPurshasePrice + (product.purchase_price * totalSalesQty)
        // console.log(totalPurshasePrice)
        totalSalesPrice += product.sales_price * totalSalesQty
        // console.log(totalSalesPrice)

      }
    }
    totalProfit = totalSalesPrice - totalPurshasePrice

    res.status(200).json({ shopSales, vendorSales, totalProfit, salesProduct: { totalProductSaled: totalProductSales, totalPurshasePrice, totalSalesPrice } })

  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}

exports.calcAllProfit = (req, res, next) => {
  try {

  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}



