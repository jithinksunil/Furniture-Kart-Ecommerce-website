const express=require('express')
const router=express.Router()
const adminCollection=require('../models/adminSchema')
const adminController=require('../controllers/adminController')

router.get('/adminLoginPage',adminController.login)

module.exports=router