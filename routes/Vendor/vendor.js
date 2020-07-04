const express = require('express');
const vendorController = require('../../controllers/Vendor/vendor')
const passport = require('passport')
require('../../helpers/passport')
const passportJWT = passport.authenticate('jwt', { session: false });
const router = express.Router();
// is admin still 

router.get('/all_vendor', passportJWT, vendorController.getAllVendor)
router.get('/:vendorId', passportJWT, vendorController.getSingleVendor)
router.get('/invoices/retrun_&_purchase', passportJWT, vendorController.getVendorPurchaseAndReturnInvoices)
router.get('/invoices/retrun_&_dept', passportJWT, vendorController.getVendorPurchaseAndDeptInvoices)
router.get('/purchase_invoices/:vendorId', passportJWT, vendorController.getVendorSalesInvoices)
router.get('/purchase/return_invoices/:vendorId', passportJWT, vendorController.getVendorReturnInvoices)
router.get('/dept/dept_invoices/:vendorId', passportJWT, vendorController.getVendorDeptInvoices)
router.get('/dept/vendor/paied_invoices_dept/:vendorId', passportJWT, vendorController.getVendorPaiedDept)



module.exports = router