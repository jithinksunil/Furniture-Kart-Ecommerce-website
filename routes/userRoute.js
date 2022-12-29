const express=require('express')
const router=express.Router()
const userController=require('../controllers/userController')
const cartController=require('../controllers/cartController')
const userSession = require('../middlewares/userSessionMW')
const userSessionMW=userSession.userSession
const withOutUserSessionMW=userSession.withOutUserSession


router.get('/',userController.home)
router.get('/user/login',withOutUserSessionMW,userController.userLogin)
router.post('/user/login/validation',userController.userValidation)
router.get('/user/logout',userSessionMW,userController.userLogout)
router.get('/user/registration',withOutUserSessionMW,userController.userRegistration)
router.post('/user/registration/Otp',userController.userRegistrationOtp)
router.post('/user/registration/otpRecieved',userController.userRegistrationOtpValidation)
router.get('/user/forgotpassword',userController.forgotPasswordPage)
router.get('/forgotpassword/newpassword',userController.forgotPasswordNewPasswordPage)
router.post('/forgotpassword/otppage',userController.forgotPasswordOtpPageRedirct)
router.get('/forgotpassword/otppage',userController.forgotPasswordOtpPage)
router.post('/forgotpassword/otpupdation',userController.forgotPasswordUpdation)
router.get('/user/home',userController.userHome)

router.get('/user/cart',userSessionMW,cartController.userCart)
router.get('/user/addtocart',userSessionMW,cartController.userAddToCart)

module.exports=router
