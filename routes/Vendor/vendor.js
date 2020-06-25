const express = require('express');
const vendorController = require('../../controllers/Vendor/vendor')
const passport = require('passport')
require('../../helpers/passport')
const passportJWT = passport.authenticate('jwt', { session: false });
const router = express.Router();


router.get('/all_vendor', passportJWT, vendorController.getAllVendor)
router.get('/:vendorId', passportJWT, vendorController.getSingleVendor)
// router.post('/add_product', passportJWT, companyController.addProduct)



module.exports = router