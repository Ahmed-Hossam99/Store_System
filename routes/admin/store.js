const express = require('express');
const adminController = require('../../controllers/admin/store')
const { validationInvoiceCompany, validate, validationAddProduct } = require('../../helpers/validation')
const { isAdmin } = require('../../helpers/isAdmin')


const passport = require('passport')
require('../../helpers/passport')
const passportJWT = passport.authenticate('jwt', { session: false });
const router = express.Router();



// router.post('/store/add_shop', passportJWT, adminController.addShop)
router.post('/store/add_product', passportJWT, isAdmin, validationAddProduct(), validate, adminController.addProduct)
router.get('/store/category', passportJWT, adminController.getProductByCategory)
router.get('/store/all_product', passportJWT, adminController.getAllProducts)
router.get('/store/:prodId', passportJWT, adminController.getProductById)
router.get('/store/name', passportJWT, adminController.getProductByName)
router.delete('/store/:prodId', passportJWT, adminController.deleteProduct)
router.put('/store/:prodId', passportJWT, adminController.updateProduct)



module.exports = router