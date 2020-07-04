const invoiceCompanyModel = require('../../models/invoices/company_invoice')
const outerDeptModel = require('../../models/finance/outer_dept')
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
    await newInvoice.save();
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