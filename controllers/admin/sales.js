const vendorModel = require('../../models/dealings/vendor')
const shopModel = require('../../models/dealings/shop')
const invoiceVendorModel = require('../../models/invoices/vendor/vendor_invoice')
const invoiceReturnVendorModel = require('../../models/invoices/vendor/return_vendor_invoice')
const invoiceShopModel = require('../../models/invoices/shop/shop_invoice')
const invoiceReturnShopModel = require('../../models/invoices/shop/return_shop_invoice')
const myDeptModel = require('../../models/finance/my_dept')
const productModel = require('../../models/products/product')

const { first } = require('lodash')


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
    const shop = await shopModel.findOne({ shopName: req.body.shop_name })
    // let newShop
    if (!shop) {
      return res.status(403).json({ message: 'shop Not exist for in this store if you want if you want to export to this shop export it as a vendore!!  ' })
    }

    // ====================================================
    // store shop invoice   
    const shopInvoice = new invoiceShopModel({
      Invoice_type: req.body.Invoice_type,
      shop_name: shop._id,
      shop_phone: shop.phoneNumber,
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
    if (req.body.paid < total) {
      shopInvoice.hasReminder = 'Yes'
    }
    await shopInvoice.save();
    // =====================================================
    // create dept if exist 
    let newDept
    if (req.body.paid < total) {
      newDept = new myDeptModel({
        salesInvoice: shopInvoice.id,
        name: shopInvoice.shop_name,
        totla_Price: total,
        paid: req.body.paid,
        remainder: total - req.body.paid,
        date: Date.now()
      })
      await newDept.save()
    }

    res.status(201).json({ shopInvoice, newDept })
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
      vendor_phone: newVendor === undefined ? vendor.phoneNumber : newVendor.phoneNumber,
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
    if (req.body.paid < total) {
      vendorInvoice.hasReminder = 'Yes'
    }
    await vendorInvoice.save();
    // ====================================
    // create dept if exist 
    let newDept
    if (req.body.paid < total) {
      newDept = new myDeptModel({
        salesInvoice: vendorInvoice._id,
        name: vendorInvoice.vendor_name,
        totla_Price: total,
        paid: req.body.paid,
        remainder: total - req.body.paid,
        date: Date.now()
      })
      await newDept.save()
    }
    res.status(201).json({ vendorInvoice, newVendor, newDept })

  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}

exports.returnProductShop = async (req, res, next) => {
  try {
    const mainInvoice = await invoiceShopModel.findOne({ Invoice_number: req.body.Invoice_number })
    console.log(mainInvoice)
    if (mainInvoice.hasReturn == 'Yes') {
      return res.status(200).json({ message: 'this invoice was used once time and can not user again ' })
    }
    console.log(mainInvoice.shop_phone)
    let returnGoods = []
    let finalGoods = []
    let finalTotal = 0
    let returnTotal = 0
    let totalReturnQty = 0
    let totalFinalQty = 0
    let len = req.body.exported_goods
    let product = mainInvoice.exported_goods
    // console.log(product)
    for (let j = 0; j < len.length; j++) {
      // to ensure that incomming barCode or product is in this invoice
      for (let i = 0; i < product.length; i++) {
        if (product[i].prodcut.toString() === len[j].prodcut.toString()) {
          // console.log(product[i].prodcut)
          if (product[i].quantity < len[j].quantity) {
            return res.status(422).json({ inProduct: len[j], message: 'This qunatity much larger than saled quantity!!' })
          }
          quantity = len[j].quantity === undefined ? 10 : len[j].quantity
          len[j].Unit_price = product[i].Unit_price
          returnGoods.push(len[j])
          product[i].quantity -= len[j].quantity
          finalGoods.push(product[i])
        }
      }
    }
    // save invoice as has return 
    const salseInvoice = await invoiceShopModel.findOne({ Invoice_number: req.body.Invoice_number })
    salseInvoice.hasReturn = 'Yes'
    await salseInvoice.save();
    // return product to the store 
    let productStore
    // console.log(returnGoods)
    for (let i = 0; i < returnGoods.length; i++) {
      productStore = await productModel.findOne({ _id: returnGoods[i].prodcut })
      console.log(productStore.avaliableQuantity)
      productStore.avaliableQuantity += returnGoods[i].quantity
      len[i].total = len[i].quantity * len[i].Unit_price
      returnTotal += len[i].total
      totalReturnQty += len[i].quantity
      console.log(productStore.avaliableQuantity)

    }
    // to ensure that available quantity increased in store
    await productStore.save();


    // ====================================== if invoice has reminder we have 3 cases 
    if (mainInvoice.hasReminder == 'Yes') {
      let dept = await myDeptModel.findOne({ salesInvoice: mainInvoice._id })
      // ================ case 1
      if (dept.remainder == returnTotal) {
        let oldRemainder = dept.remainder
        dept.Paid_debt = 'true'
        // console.log(dept)
        //final total will pranted to shop with new date after returned products 
        finalTotal = mainInvoice.totla_Price - returnTotal
        totalFinalQty = mainInvoice.imported_quantity - totalReturnQty
        const fianlInvoice = new invoiceShopModel({
          Invoice_type: 'sales invoice',
          shop_name: mainInvoice.shop_name,
          shop_phone: mainInvoice.shop_phone,
          exported_goods: finalGoods,
          imported_quantity: totalFinalQty,
          totla_Price: finalTotal,
          paid: finalTotal,
          remainder: dept.remainder,
          date: Date.now()
        })
        await fianlInvoice.save();
        // return invoice to admin to show his returned 
        let totalMony = 0
        const returnInvoice = new invoiceReturnShopModel({
          Invoice_type: 'Return invoice',
          sales_invoice_number: mainInvoice.Invoice_number,
          shop_name: mainInvoice.shop_name,
          shop_phone: mainInvoice.shop_phone,
          return_goods: returnGoods,
          toal_quantity: totalReturnQty,
          totla_Price: totalMony,
          notes: ` this invoice has dept it was = ${oldRemainder} and this dept = total return price   it was ${returnTotal} and this dept  will paied automatically by your system and remainder dept to shop it's become = ${0}  `,
          cashier: req.user._id,
          date: Date.now()
        })
        await returnInvoice.save();
        await dept.save();
        // finally send response from server 
        return res.status(200).json({ dept: { fianlDept: dept.Paid_debt }, message: 'the returned qty tptal price = shop dept and dept will be paid automatic by this return ', fianlInvoice, returnInvoice })
      }

      // =========================== case 2
      if (dept.remainder > returnTotal) {
        let oldRemainder = dept.remainder
        dept.remainder -= returnTotal
        // console.log(dept)
        // final invoice to shop  to show his new data and his new dept
        finalTotal = mainInvoice.totla_Price - returnTotal
        totalFinalQty = mainInvoice.imported_quantity - totalReturnQty
        const fianlInvoice = new invoiceShopModel({
          Invoice_type: 'sales invoice',
          shop_name: mainInvoice.shop_name,
          shop_phone: mainInvoice.shop_phone,
          exported_goods: finalGoods,
          imported_quantity: totalFinalQty,
          totla_Price: finalTotal,
          paid: mainInvoice.paid,
          remainder: dept.remainder,
          hasReminder: 'Yes',
          date: Date.now()
        })
        await fianlInvoice.save();
        dept.salseInvoice = fianlInvoice.id
        let totalMony = 0
        const returnInvoice = new invoiceReturnShopModel({
          Invoice_type: 'Return invoice',
          sales_invoice_number: mainInvoice.Invoice_number,
          shop_name: mainInvoice.shop_name,
          shop_phone: mainInvoice.shop_phone,
          return_goods: returnGoods,
          toal_quantity: totalReturnQty,
          totla_Price: totalMony,
          notes: ` this invoice has dept it was = ${oldRemainder} and this dept > total return price   it was ${returnTotal} and this dept  will updated automatically by your system and remainder dept to shop it's become = ${dept.remainder}  `,
          cashier: req.user._id,
          date: Date.now()
        })
        await returnInvoice.save();
        await dept.save();
        return res.status(200).json({ newDept: { remainder: dept.remainder }, message: 'the returned qty tptal price < shop dept and dept will be updated automatic by this returnGoods ', fianlInvoice, returnInvoice })
      }
      // ====================== case 3
      if (dept.remainder < returnTotal) {
        let firstInvoice = await invoiceShopModel.findOne({ Invoice_number: req.body.Invoice_number })
        firstInvoice.hasReminder = 'No'
        let totalMony = 0
        dept.Paid_debt = 'true'
        // make new invoice to customer 
        finalTotal = firstInvoice.totla_Price - returnTotal
        totalFinalQty = firstInvoice.imported_quantity - totalReturnQty
        const fianlInvoice = new invoiceShopModel({
          Invoice_type: 'sales invoice',
          shop_name: firstInvoice.shop_name,
          shop_phone: firstInvoice.shop_phone,
          exported_goods: finalGoods,
          imported_quantity: totalFinalQty,
          totla_Price: finalTotal,
          paid: finalTotal,
          remainder: 0,
          date: Date.now()
        })
        await fianlInvoice.save();
        // console.log(dept)
        totalMony = returnTotal - dept.remainder
        // console.log(totalMony)
        // make return invoice with new date 
        const returnInvoice = new invoiceReturnShopModel({
          Invoice_type: 'Return invoice',
          shop_name: mainInvoice.shop_name,
          shop_phone: mainInvoice.shop_phone,
          sales_invoice_number: mainInvoice.Invoice_number,
          return_goods: returnGoods,
          toal_quantity: totalReturnQty,
          totla_Price: totalMony,
          notes: ` this invoice has dept it was = ${dept.remainder} and this dept < total return price   it was ${returnTotal} and this dept   paid automatically by your system and remainder mony to shop it's become = ${totalMony}  `,
          cashier: req.user._id,
          shop: req.user.shop,
          date: Date.now()
        })
        await firstInvoice.save();
        await dept.save();
        await returnInvoice.save();
        return res.status(201).json({ returnInvoice, fianlInvoice, message: 'the returned qty tptal price < shop dept and dept will be paid automatic by this return ' })
      }
    }

    // ==================================if invoice not has reminder =>
    // make new invoice to customer 
    finalTotal = mainInvoice.totla_Price - returnTotal
    totalFinalQty = mainInvoice.imported_quantity - totalReturnQty
    const fianlInvoice = new invoiceShopModel({
      Invoice_type: 'sales invoice',
      shop_name: mainInvoice.shop_name,
      shop_phone: mainInvoice.shop_phone,
      exported_goods: finalGoods,
      imported_quantity: totalFinalQty,
      totla_Price: finalTotal,
      paid: finalTotal,
      date: Date.now()
    })
    await fianlInvoice.save();
    // make new return invoice 
    const returnInvoice = new invoiceReturnShopModel({
      Invoice_type: 'Return invoice',
      shop_name: mainInvoice.shop_name,
      shop_phone: mainInvoice.shop_phone,
      sales_invoice_number: mainInvoice.Invoice_number,
      return_goods: returnGoods,
      toal_quantity: totalReturnQty,
      totla_Price: returnTotal,
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

exports.returnProductTrader = async (req, res, next) => {
  try {
    console.log('here!!')
    const mainInvoice = await invoiceVendorModel.findOne({ Invoice_number: req.body.Invoice_number })
    // console.log(mainInvoice)
    if (mainInvoice.hasReturn == 'Yes') {
      return res.status(200).json({ message: 'this invoice was used once time and can not user again ' })
    }
    let returnGoods = []
    let finalGoods = []
    let finalTotal = 0
    let returnTotal = 0
    let totalReturnQty = 0
    let totalFinalQty = 0
    let len = req.body.exported_goods
    let product = mainInvoice.exported_goods
    // console.log(product)
    for (let j = 0; j < len.length; j++) {
      // to ensure that incomming barCode or product is in this invoice
      for (let i = 0; i < product.length; i++) {
        if (product[i].prodcut.toString() === len[j].prodcut.toString()) {
          // console.log(product[i].prodcut)
          if (product[i].quantity < len[j].quantity) {
            return res.status(422).json({ inProduct: len[j], message: 'This qunatity much larger than saled quantity!!' })
          }
          quantity = len[j].quantity === undefined ? 10 : len[j].quantity
          len[j].Unit_price = product[i].Unit_price
          returnGoods.push(len[j])
          product[i].quantity -= len[j].quantity
          finalGoods.push(product[i])
        }
      }
    }

    // return product to the store 
    let productStore
    for (let i = 0; i < returnGoods.length; i++) {
      productStore = await productModel.findOne({ _id: returnGoods[i].prodcut })
      console.log(productStore.avaliableQuantity)
      productStore.avaliableQuantity += returnGoods[i].quantity
      len[i].total = len[i].quantity * len[i].Unit_price
      returnTotal += len[i].total
      totalReturnQty += len[i].quantity
      console.log(productStore.avaliableQuantity)

    }
    // to ensure that available quantity increased in store
    await productStore.save();
    // save invoice as hasReturn
    const salseInvoice = await invoiceVendorModel.findOne({ Invoice_number: req.body.Invoice_number })
    salseInvoice.hasReturn = 'Yes'
    await salseInvoice.save();


    // ====================================== if invoice has reminder we have 3 cases 
    if (mainInvoice.hasReminder == 'Yes') {
      let dept = await myDeptModel.findOne({ salesInvoice: mainInvoice._id })
      // ================ case 1
      if (dept.remainder == returnTotal) {
        let oldRemainder = dept.remainder
        dept.Paid_debt = 'true'
        //final total will pranted to shop with new date after returned products 
        finalTotal = mainInvoice.totla_Price - returnTotal
        totalFinalQty = mainInvoice.imported_quantity - totalReturnQty
        const fianlInvoice = new invoiceVendorModel({
          Invoice_type: 'sales invoice',
          vendor_name: mainInvoice.vendor_name,
          vendor_phone: mainInvoice.vendor_phone,
          nationalId: mainInvoice.nationalId,
          exported_goods: finalGoods,
          imported_quantity: totalFinalQty,
          totla_Price: finalTotal,
          paid: finalTotal,
          remainder: 0,
          date: Date.now()
        })
        await fianlInvoice.save();
        // return invoice to admin to show his returned 
        let totalMony = 0
        const returnInvoice = new invoiceReturnVendorModel({
          Invoice_type: 'Return invoice',
          sales_invoice_number: mainInvoice.Invoice_number,
          vendor_name: mainInvoice.vendor_name,
          vendor_phone: mainInvoice.vendor_phone,
          nationalId: mainInvoice.nationalId,
          return_goods: returnGoods,
          toal_quantity: totalReturnQty,
          totla_Price: totalMony,
          notes: ` this invoice has dept it was = ${oldRemainder} and this dept = total return price   it was ${returnTotal} and this dept  will paied automatically by your system and remainder dept to shop it's become = ${0}  `,
          cashier: req.user._id,
          date: Date.now()
        })
        await returnInvoice.save();
        await dept.save();
        // finally send response from server 
        return res.status(200).json({ dept: { fianlDept: dept.Paid_debt }, message: 'the returned qty tptal price = shop dept and dept will be paid automatic by this return ', fianlInvoice, returnInvoice })
      }

      // =========================== case 2
      if (dept.remainder > returnTotal) {
        let oldRemainder = dept.remainder
        dept.remainder -= returnTotal
        // final invoice to shop  to show his new data and his new dept
        finalTotal = mainInvoice.totla_Price - returnTotal
        totalFinalQty = mainInvoice.imported_quantity - totalReturnQty
        const fianlInvoice = new invoiceVendorModel({
          Invoice_type: 'sales invoice',
          vendor_name: mainInvoice.vendor_name,
          vendor_phone: mainInvoice.vendor_phone,
          nationalId: mainInvoice.nationalId,
          exported_goods: finalGoods,
          imported_quantity: totalFinalQty,
          totla_Price: finalTotal,
          paid: mainInvoice.paid,
          remainder: dept.remainder,
          hasReminder: 'Yes',
          date: Date.now()
        })
        await fianlInvoice.save();
        dept.salseInvoice = fianlInvoice.id
        let totalMony = 0
        const returnInvoice = new invoiceReturnVendorModel({
          Invoice_type: 'Return invoice',
          sales_invoice_number: mainInvoice.Invoice_number,
          vendor_name: mainInvoice.vendor_name,
          vendor_phone: mainInvoice.vendor_phone,
          nationalId: mainInvoice.nationalId,
          return_goods: returnGoods,
          toal_quantity: totalReturnQty,
          totla_Price: totalMony,
          notes: ` this invoice has dept it was = ${oldRemainder} and this dept > total return price   it was ${returnTotal} and this dept  will updated automatically by your system and remainder dept to shop it's become = ${dept.remainder}  `,
          cashier: req.user._id,
          date: Date.now()
        })
        await returnInvoice.save();
        await dept.save();
        console.log(fianlInvoice.id)
        console.log(dept.salseInvoice)
        return res.status(200).json({ newDept: { remainder: dept.remainder }, message: 'the returned qty tptal price < shop dept and dept will be updated automatic by this returnGoods ', fianlInvoice, returnInvoice })
      }
      // ====================== case 3
      if (dept.remainder < returnTotal) {
        let firstInvoice = await invoiceVendorModel.findOne({ Invoice_number: req.body.Invoice_number })
        firstInvoice.hasReminder = 'No'
        let totalMony = 0
        dept.Paid_debt = 'true'
        // make new invoice to customer 
        finalTotal = firstInvoice.totla_Price - returnTotal
        totalFinalQty = firstInvoice.imported_quantity - totalReturnQty
        const fianlInvoice = new invoiceVendorModel({
          Invoice_type: 'sales invoice',
          vendor_name: firstInvoice.vendor_name,
          vendor_phone: firstInvoice.vendor_phone,
          nationalId: firstInvoice.nationalId,
          exported_goods: finalGoods,
          imported_quantity: totalFinalQty,
          totla_Price: finalTotal,
          paid: finalTotal,
          remainder: 0,
          date: Date.now()
        })
        await fianlInvoice.save();
        totalMony = returnTotal - dept.remainder
        // make return invoice with new date 
        const returnInvoice = new invoiceReturnVendorModel({
          Invoice_type: 'Return invoice',
          vendor_name: mainInvoice.vendor_name,
          vendor_phone: mainInvoice.vendor_phone,
          nationalId: mainInvoice.nationalId,
          sales_invoice_number: mainInvoice.Invoice_number,
          return_goods: returnGoods,
          toal_quantity: totalReturnQty,
          totla_Price: totalMony,
          notes: ` this invoice has dept it was = ${dept.remainder} and this dept < total return price   it was ${returnTotal} and this dept   paid automatically by your system and remainder mony to shop it's become = ${totalMony}  `,
          cashier: req.user._id,
          date: Date.now()
        })
        await firstInvoice.save();
        await dept.save();
        await returnInvoice.save();
        return res.status(201).json({ returnInvoice, fianlInvoice, message: 'the returned qty tptal price < shop dept and dept will be paid automatic by this return ' })
      }
    }

    // ==================================if invoice not has reminder =>
    // make new invoice to customer 
    finalTotal = mainInvoice.totla_Price - returnTotal
    totalFinalQty = mainInvoice.imported_quantity - totalReturnQty
    const fianlInvoice = new invoiceVendorModel({
      Invoice_type: 'sales invoice',
      vendor_name: mainInvoice.vendor_name,
      vendor_phone: mainInvoice.vendor_phone,
      nationalId: mainInvoice.nationalId,
      exported_goods: finalGoods,
      imported_quantity: totalFinalQty,
      totla_Price: finalTotal,
      paid: finalTotal,
      date: Date.now()
    })
    await fianlInvoice.save();
    // make new return invoice 
    const returnInvoice = new invoiceReturnVendorModel({
      Invoice_type: 'Return invoice',
      vendor_name: mainInvoice.vendor_name,
      vendor_phone: mainInvoice.vendor_phone,
      nationalId: mainInvoice.nationalId,
      sales_invoice_number: mainInvoice.Invoice_number,
      return_goods: returnGoods,
      toal_quantity: totalReturnQty,
      totla_Price: returnTotal,
      cashier: req.user._id,
      date: Date.now()
    })
    await returnInvoice.save();
    // save invoice as has return 


    res.status(201).json({ returnInvoice, fianlInvoice })
  } catch (error) {
    console.log(error)
    res.json(error)

  }
}