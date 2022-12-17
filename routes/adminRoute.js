const express=require('express')
const router=express.Router()
const adminCollection=require('../models/adminSchema')
const adminController=require('../controllers/adminController')

router.get('/admin/login',adminController.adminLogin)
router.post('/admin/login/validation',adminController.adminLoginValidation)
router.get('/admin/profile',adminController.adminProfile)
module.exports=router