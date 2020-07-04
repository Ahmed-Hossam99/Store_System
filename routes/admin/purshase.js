const express = require('express');
const companyController = require('../../controllers/admin/purchase')
const { isAdmin } = require('../../helpers/isAdmin')
const { validationInvoiceCompany, validate, validationAddProduct } = require('../../helpers/validation')
const passport = require('passport')
require('../../helpers/passport')
const passportJWT = passport.authenticate('jwt', { session: false });
const router = express.Router();


router.post('/purshase/purshase_product', passportJWT, isAdmin, validationInvoiceCompany(), validate, companyController.purchaseProduct)



module.exports = router