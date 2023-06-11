const express=require('express')
const router=express.Router()
const userController=require('../controllers/userController')
const userSession = require('../middlewares/userSessionMW')
const userSessionMW=userSession.userSession
const userSessionMWForAjax=userSession.userSessionForAjax
const withOutUserSessionMW=userSession.withOutUserSession

router.get('/',userController.home)
router.get('/login',withOutUserSessionMW,userController.userLogin)
router.post('/login/validation',userController.userValidation)
router.get('/logout',userSessionMW,userController.userLogout)
router.get('/registration',withOutUserSessionMW,userController.userRegistration)
router.post('/registration/Otp',userController.userRegistrationOtp)
router.post('/registration/otpRecieved',userController.userRegistrationOtpValidation)
router.get('/forgotpassword',userController.forgotPasswordPage)
router.get('/forgotpassword/otppage',userController.forgotPasswordOtpPage)
router.post('/forgotpassword/newpassword',userController.forgotPasswordNewPasswordPage)
router.post('/forgotpassword/passwordupdation',userController.forgotPasswordUpdation)
router.get('/profile',userSessionMW,userController.userProfile)
router.get('/change/password',userSessionMW,userController.changePassword)
router.post('/update/password',userSessionMW,userController.updatePassword)
router.get('/edit/account',userSessionMW,userController.editAccount)
router.post('/update/account',userSessionMW,userController.updateAccount)
router.get('/jithin',userController.errorRouter)

module.exports=router
