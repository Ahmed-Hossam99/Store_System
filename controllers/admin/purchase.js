const invoiceCompanyModel = require('../../models/invoices/company_invoice')
const accountModel = require('../../models/finance/account')
const myDeptModel = require('../../models/finance/my_dept')
const outerDeptModel = require('../../models/finance/outer_dept')
const productModel = require('../../models/products/product')
const colorModel = require('../../models/products/color')
const sizeModel = require('../../models/products/size')
const categoryModel = require('../../models/products/category')
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

    // ========================================================
    //  store dept if exist 
    let newDept
    if (req.body.paid < total) {
      newDept = new outerDeptModel({
        name: companyData === undefined ? company._id : companyData.id,
        totla_Price: total,
        paid: req.body.paid,
        remainder: total - req.body.paid,
        date: req.body.date
      })
      await newDept.save()
    }
    // ==============================================================================
    const account = await accountModel.findOne({ _id: '5ef07dccc88fe5194456dc25' })
    console.log(account)
    if (req.body.paid < total) {
      account.Total_outer_debt += total - req.body.paid
    }
    await account.save();
    await newInvoice.save();
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


// exports.addAccount = async (req, res, next) => {
//   try {
//     const newData = new accountModel({
//       current_balance: req.body.current_balance,
//       Total_my_debt: req.body.Total_my_debt,
//       Total_outer_debt: req.body.Total_outer_debt,
//     })
//     await newData.save();
//     console.log('here')

//   } catch (error) {
//     console.log(error)
//     res.json({ error })
//   }

// }

// exports.addProduct = async (req, res, next) => {
//   try {

//     const color = await colorModel.findOne({ name: req.body.color })
//     let newColor
//     if (!color) {
//       newColor = new colorModel({
//         name: req.body.color
//       })
//       await newColor.save();
//       console.log(newColor)
//     }
//     const size = await sizeModel.findOne({ size: req.body.size })
//     let newSize
//     if (!size) {
//       newSize = new sizeModel({
//         size: req.body.size
//       })
//       await newSize.save();
//       console.log(newSize)
//     }
//     const category = await categoryModel.findOne({ name: req.body.category })
//     let newCategory
//     if (!category) {
//       newCategory = new categoryModel({
//         name: req.body.category
//       })
//       await newCategory.save();
//       console.log(newCategory)
//     }
//     // ============================================
//     const newProduct = new productModel({
//       name: req.body.name,
//       description: req.body.description,
//       price: req.body.price,
//       avaliableQuantity: req.body.avaliableQuantity,
//       purchase_price: req.body.purchase_price,
//       sales_price: req.body.sales_price,
//       size: size === undefined ? newSize.id : size._id,
//       color: color === undefined ? newColor.id : color._id,
//       category: category === undefined ? newCategory.id : category._id
//     })
//     await newProduct.save();
//     res.status(201).json({ newProduct })

//   } catch (error) {
//     console.log(error)
//     res.json({ error })
//   }

// }
















































// if (req.body.paid > account.current_balance) {
    //   return res.status(422).json({
    //     message: 'your balance not enought !! '
    //   })
    // }
    // if (req.body.paid < account.current_balance) {
    //   account.current_balance -= req.body.paid
    // }
    //  fix all accont data 