const invoiceCompanyModel = require('../../models/invoices/company_invoice')
const accountModel = require('../../models/finance/account')
const myDeptModel = require('../../models/finance/my_dept')
const outerDeptModel = require('../../models/finance/outer_dept')
const productModel = require('../../models/products/product')
const colorModel = require('../../models/products/color')
const sizeModel = require('../../models/products/size')
const categoryModel = require('../../models/products/category')
const companyModel = require('../../models/dealings/company')
const companyInvoiceModel = require('../../models/invoices/company_invoice')

exports.purchaseProduct = async (req, res, next) => {
  try {
    let goods = []
    let total = 0
    let quantity = 0
    req.body.imported_goods.forEach(prod => {
      prod.total = prod.quantity * prod.Unit_price
      total += prod.total
      quantity += prod.quantity
      goods.push(prod)
    });
    // console.log(goods)
    // console.log('========================================')
    // console.log(quantity)
    // console.log(total)

    const newInvoice = new invoiceCompanyModel({
      Invoice_type: req.body.Invoice_type,
      company_name: req.body.company_name,
      company_number: req.body.company_number,
      company_phone: req.body.company_phone,
      imported_goods: goods,
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
    // ========================================================
    //  store dept if exist 
    let newDept
    if (req.body.paid < total) {
      newDept = new outerDeptModel({
        name: req.body.company_name,
        totla_Price: total,
        paid: req.body.paid,
        remainder: total - req.body.paid,
        date: req.body.date
      })
      await newDept.save()
    }
    // ==============================================================================
    const account = await accountModel.findOne({ _id: '5ee1b28a006c091a9c6ed849' })
    console.log(account)
    if (req.body.paid < total) {
      account.Total_outer_debt += total - req.body.paid
    }
    await account.save();
    await newInvoice.save();
    // ============================================================
    // ckeck if company existing 
    const company = await companyModel.findOne({ companyNumber: req.body.company_number })
    console.log(company)
    // if not => create new company
    let companyData
    if (!company) {
      companyData = new companyModel({
        companyName: req.body.company_name,
        phoneNumber: req.body.company_phone,
        companyNumber: req.body.company_number
      })
      await companyData.save();
    }
    res.status(201).json({
      message: 'Proccess done !! ',
      newInvoice,
      newDept,
      companyData
    })


  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}

exports.returnProduct = (req, res, next) => {
  //======================= not yet============================================  
}


exports.getSingleCompany = async (req, res, next) => {
  try {
    const companyId = req.params.companyId
    const company = await companyModel.findById({ _id: companyId })
    const companyDeptInvoices = await outerDeptModel.find({ name: companyId })
    const companyPurchaseInvoices = await companyInvoiceModel.find({ company_name: companyId })
    let totalDept = 0
    companyDeptInvoices.forEach(item => {
      totalDept += item.remainder
      console.log(totalDept)
    });
    let totalPurchase = 0
    companyPurchaseInvoices.forEach(item => {
      totalPurchase += item.totla_Price
    });
    res.status(200).json({ company, companyDept: { companyDeptInvoices, total: { totalDept } }, companyPurchase: { companyPurchaseInvoices, total: { totalPurchase } } });

  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}

exports.addProduct = async (req, res, next) => {
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
    const newProduct = new productModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      avaliableQuantity: req.body.avaliableQuantity,
      size: size === undefined ? newSize._id : size._id,
      color: color === undefined ? newColor.id : color._id,
      category: category === undefined ? newCategory._id : category._id
    })
    await newProduct.save();
    res.status(201).json({ newProduct })

  } catch (error) {
    console.log(error)
    res.json({ error })
  }

}












// ================================

// get all company 
exports.getAllCompany = async (req, res, next) => {
  try {
    const company = await companyModel.find()
    if (company.length <= 0) {
      return req.status(200).json({ message: 'no company added !!' })
    }
    res.status(200).json({ company })
  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}