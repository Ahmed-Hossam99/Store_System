const express = require('express');
const shopController = require('../../controllers/shop/shop')
const { isAdmin } = require('../../helpers/isAdmin')
const passport = require('passport')
require('../../helpers/passport')
const passportJWT = passport.authenticate('jwt', { session: false });
const router = express.Router();



router.post('/add_shop', passportJWT, shopController.addShop)
router.get('/cashier_invoices', passportJWT, shopController.getCashierInvoices)
router.get('/all_shops', passportJWT, shopController.getAllShop)
router.post('/add_product', passportJWT, shopController.addShopProduct)
router.get('/shop_all_product', passportJWT, shopController.getShopProducts)
router.post('/return_product', passportJWT, shopController.returnProduct)
router.post('/salse_product', passportJWT, shopController.salesProducts)
router.get('/shop_inovices', passportJWT, shopController.getShopInvoices)
router.get('/shop_cashier/:shopId', passportJWT, isAdmin, shopController.shopCashiers)
router.get('/cashier/:cashierId', passportJWT, isAdmin, shopController.getcashier)
router.get('/shop/invoices/:shopId', passportJWT, isAdmin, shopController.ShopInvoicesAdmin)
router.get('/invoices/has_return', passportJWT, isAdmin, shopController.getInvoiceHasReturn)
router.get('/shop/invoices/has_return/:shopId', passportJWT, isAdmin, shopController.getShopInvoiceHasReturn)
router.get('/invoices/retrun_&_purchase', passportJWT, shopController.getShopPurchaseAndReturnInvoices)
router.get('/invoices/retrun_&_dept', passportJWT, shopController.getShopPurchaseAndDeptInvoices)

module.exports = router