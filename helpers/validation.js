const { body, validationResult, check } = require('express-validator')

const signupValidationRules = () => {
  return [
    check('email')
      .isEmail()
      .withMessage('please enter valid e-mail')
      .normalizeEmail(),

    body('password', 'Password has to be valid.')
      .isLength({ min: 5 })
      .trim(),
    // .isAlphanumeric()
    body('name', ' Name must be entered . ')
      .isLength({ min: 5 })
      .trim(),
    body('shop', ' shop must be entered . ')
      .trim(),
    body('type').isIn(['admin', 'user']),
  ]
}
const signinValidationRules = () => {
  return [
    check('email')
      .isEmail()
      .withMessage('please enter valid e-mail')
      .normalizeEmail(),
    body('password', 'Password has to be valid.')
      .isLength({ min: 5 })
      .trim(),

  ]
}

const validationInvoiceCompany = () => {
  return [
    body('Invoice_type')
      .isIn(['Purchase invoice', ' Return invoice']).trim(),
    body('company_name').isString(),
    body('company_number').isString().trim(),
    body('company_phone').isString(),
    body('imported_goods').exists().withMessage('missing'),
    check('imported_goods.*.prodcut').exists().withMessage('product must be enterd'),
    check('imported_goods.*.quantity').exists().withMessage('quantity must be enterd'),
    check('imported_goods.*.Unit_price').exists().withMessage('Unit_price must be enterd'),
    body('paid').isNumeric(),


  ]
}

const validationAddProduct = () => {

  return [
    body('name', 'name must to be enter.')
      .isLength({ min: 5 })
      .trim(),
    // .isAlphanumeric()
    body('description', ' description must be entered . ')
      .isLength({ min: 5 })
      .trim(),
    body('size', ' size must be entered . ').isString().trim(),

    body('color', ' color must be entered . ').isString()
      .trim(),
    body('category', ' category must be entered . ').isString()
      .trim(),
    body('avaliableQuantity', 'avaliableQuantity must be entered ').isNumeric(),
    body('purchase_price', 'purchase_price must be entered ').isNumeric(),
    body('sales_price', 'sales_price must be entered').isNumeric()
  ]
}
const validationAddProductShop = () => {

  return [
    body('name', 'name must to be enter.')
      .isLength({ min: 5 })
      .trim(),

    // .isAlphanumeric()
    body('description', ' description must be entered . ')
      .isLength({ min: 5 })
      .trim(),
    body('size', ' size must be entered . ').isString().trim(),

    body('color', ' color must be entered . ').isString()
      .trim(),
    body('category', ' category must be entered . ').isString()
      .trim(),
    body('barCode', 'barCode must to be enter.').isString(),
    body('avaliableQuantity', 'avaliableQuantity must be entered ').isNumeric(),
    body('purchase_price', 'purchase_price must be entered ').isNumeric(),
    body('sales_price', 'sales_price must be entered').isNumeric()
  ]
}




const validationexportedProductTader = () => {

  return [
    body('Invoice_type')
      .isIn(['sales invoice', ' Return invoice']).trim(),
    body('vendor_name').isString(),
    body('vendor_phone').isString().trim(),
    body('nationalId').isString(),
    body('exported_goods').exists().withMessage('missing'),
    check('exported_goods.*.prodcut').isString().withMessage('product must be enterd'),
    check('exported_goods.*.quantity').exists().withMessage('quantity must be enterd'),
    body('paid').isNumeric(),


  ]
}

const validationexportedProductShop = () => {
  return [
    body('Invoice_type')
      .isIn(['sales invoice', ' Return invoice']).trim(),
    body('shop_name').isString(),
    body('exported_goods').exists().withMessage('missing'),
    check('exported_goods.*.prodcut').isString().withMessage('product must be enterd'),
    check('exported_goods.*.quantity').exists().withMessage('quantity must be enterd'),
    body('paid').isNumeric(),


  ]
}


// body('Invoice_type')
//       .isIn(['sales invoice', ' Return invoice']).trim(),
const validationReturnProductShop = () => {

  return [
    body('Invoice_number').isNumeric(),
    body('customer_name').isString(),
    body('customer_phone').isString().trim(),
    body('items_name').exists().withMessage('missing items name'),
    check('items_name.*.barCode').isString().withMessage('barCode must be enterd'),
  ]
}

const validationReturnProductShopToStore = () => {

  return [
    body('Invoice_number').isNumeric(),
    body('exported_goods').exists().withMessage('missing exported_goods'),
    check('exported_goods.*.prodcut').isString().withMessage('prodcut must be enterd'),
  ]
}




const validationSalesProductShop = () => {

  return [
    body('Invoice_type')
      .isIn(['sales invoice', ' Return invoice']).trim(),
    body('customer_name').isString(),
    body('customer_phone').isString().trim(),
    body('items_name').exists().withMessage('missing items name'),
    check('items_name.*.barCode').isString().withMessage('barCode must be enterd'),
  ]
}

const validationAddShop = () => {

  return [
    body('shopName', 'shop name must be enterd').isString(),
    body('phoneNumber', 'phone Number must be enterd').isString(),

  ]
}



















// this to show error if exist 
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}
module.exports = {
  signinValidationRules,
  signupValidationRules,
  validationInvoiceCompany,
  validationAddProduct,
  validationAddShop,
  validationexportedProductTader,
  validationexportedProductShop,
  validationReturnProductShopToStore,
  validationAddProductShop,
  validationReturnProductShop,
  validationSalesProductShop,
  validate,
}




