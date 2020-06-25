const express = require('express');
const companyController = require('../../controllers/company/company')
const passport = require('passport')
require('../../helpers/passport')
const passportJWT = passport.authenticate('jwt', { session: false });
const router = express.Router();


router.get('/all_company', passportJWT, companyController.getAllCompany)
router.get('/:companyId', passportJWT, companyController.getSingleCompany)
router.post('/add_product', passportJWT, companyController.addProduct)



module.exports = router