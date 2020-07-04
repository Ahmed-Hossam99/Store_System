const invoiceCompanyModel = require('../../models/invoices/company_invoice')
const outerDeptModel = require('../../models/finance/outer_dept')
const companyModel = require('../../models/dealings/company')

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

    // ===================================================================
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
      console.log(companyData)
    }

    const newInvoice = new invoiceCompanyModel({
      Invoice_type: req.body.Invoice_type,
      company_name: companyData === undefined ? company._id : companyData.id,
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
    await newInvoice.save();
    // ========================================================
    //  store dept if exist 
    let newDept
    if (req.body.paid < total) {
      newDept = new outerDeptModel({
        salseInvoice: newInvoice.id,
        name: companyData === undefined ? company._id : companyData.id,
        totla_Price: total,
        paid: req.body.paid,
        remainder: total - req.body.paid,
        date: req.body.date
      })
      await newDept.save()
    }


    // ============================================================

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












































// if (req.body.paid > account.current_balance) {
    //   return res.status(422).json({
    //     message: 'your balance not enought !! '
    //   })
    // }
    // if (req.body.paid < account.current_balance) {
    //   account.current_balance -= req.body.paid
    // }
    //  fix all accont data 