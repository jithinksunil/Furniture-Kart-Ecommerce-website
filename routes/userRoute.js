const express=require('express')
const router=express.Router()
const userCollection=require('../models/userSchema')
const userController=require('../controllers/userController')

// router.get('/home',userController.)
router.get('/',userController.home)
router.get('/user/login',userController.userLogin)
router.post('/user/login/validation',userController.userValidation)
router.get('/user/logout',userController.userLogout)
router.get('/user/registration',userController.userRegistration)
router.post('/user/registration/validation',userController.userRegistrationValidation)

module.exports=router