const express = require('express');
const deptController = require('../../controllers/admin/dept')
const { isAdmin } = require('../../helpers/isAdmin')
const { validationInvoiceCompany, validate, validationAddProduct } = require('../../helpers/validation')
const passport = require('passport')
require('../../helpers/passport')
const passportJWT = passport.authenticate('jwt', { session: false });
const router = express.Router();


// router.post('/purshase/purshase_product', passportJWT, isAdmin, validationInvoiceCompany(), validate, companyController.purchaseProduct)
// // router.post('/purshase/try', passportJWT, isAdmin, companyController.addAccount)

router.put('/vendor/dept/:invoiceId', passportJWT, deptController.paiedVendorDept)
router.put('/shop/dept/:invoiceId', passportJWT, deptController.paiedShopDept)


module.exports = router