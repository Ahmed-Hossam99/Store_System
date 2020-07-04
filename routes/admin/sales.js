const express = require('express');
const adminController = require('../../controllers/admin/sales')
const { validationexportedProductTader, validationexportedProductShop, validationReturnProductShopToStore, validate, } = require('../../helpers/validation')
const { isAdmin } = require('../../helpers/isAdmin')

const passport = require('passport')
require('../../helpers/passport')
const passportJWT = passport.authenticate('jwt', { session: false });
const router = express.Router();



router.post('/sales/sales_vendor', passportJWT, isAdmin, validationexportedProductTader(), validate, adminController.exportedProductTader)
router.post('/sales/return_product/_vendor', passportJWT, isAdmin, validationReturnProductShopToStore(), validate, adminController.returnProductTrader)

router.post('/sales/sales_shop', passportJWT, isAdmin, validationexportedProductShop(), validate, adminController.exportedProductShop)

router.post('/sales/return_product_shop', passportJWT, isAdmin, validationReturnProductShopToStore(), validate, adminController.returnProductShop)




module.exports = router