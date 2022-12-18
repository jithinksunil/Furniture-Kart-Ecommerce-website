const express=require('express')
const router=express.Router()
const adminCollection=require('../models/adminSchema')
const adminController=require('../controllers/adminController')

router.get('/admin/login',adminController.adminLogin)
router.post('/admin/login/validation',adminController.adminLoginValidation)
router.get('/admin/dashboard',adminController.adminDashBoard)
router.get('/admin/products/usermangement',adminController.userManagement)
router.get('/admin/products/categorymangement',adminController.categoryManagement)
router.get('/admin/products/productmangement',adminController.productManagement)
router.get('/admin/orders',adminController.orderManagement)
router.get('/admin/coupons',adminController.couponManagement)
module.exports=router