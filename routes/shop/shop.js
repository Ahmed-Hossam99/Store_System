const express = require('express');
const shopController = require('../../controllers/shop/shop')
const passport = require('passport')
require('../../helpers/passport')
const passportJWT = passport.authenticate('jwt', { session: false });
const router = express.Router();



router.post('/add_shop', passportJWT, shopController.addShop)
router.get('/cashier_invoices', passportJWT, shopController.getCashierInvoices)
router.get('/all_shops', passportJWT, shopController.getAllShop)
router.get('/:shopId', passportJWT, shopController.shopCashiers)
// router.post('/shop/add_product', passportJWT, adminController.addProduct)
// router.get('/shop/all_product', passportJWT, adminController.getAllProducts)
// router.delete('/shop/:prodId', passportJWT, adminController.deleteProduct)
// router.put('/shop/:prodId', passportJWT, adminController.updateProduct)



module.exports = router