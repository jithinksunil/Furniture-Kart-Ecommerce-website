const express=require('express')
const router=express.Router()
const userController=require('../controllers/userController')
const cartController=require('../controllers/cartController')
const wishlistController=require('../controllers/wishlistController')
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
router.get('/user/forgotpassword/otppage',userController.forgotPasswordOtpPage)
router.post('/forgotpassword/newpassword',userController.forgotPasswordNewPasswordPage)
router.post('/forgotpassword/passwordupdation',userController.forgotPasswordUpdation)
router.get('/user/categories',userController.categoriesPage)


router.get('/user/cart',userSessionMW,cartController.userCart)
router.get('/user/addtocart',userSessionMW,cartController.userAddToCart)
router.get('/user/addfromcart',userSessionMW,cartController.userAddFromCart)
router.get('/user/deductfromcart',userSessionMW,cartController.userDeductFromCart)
router.get('/user/cart/removeitem',userSessionMW,cartController.removeFromCart)

router.get('/user/wishlist',userSessionMW,wishlistController.userWishlist)
router.get('/user/addtowishlist',userSessionMW,wishlistController.userAddToWishlist)
router.get('/user/wishlist/removeitem',userSessionMW,wishlistController.removeFromWishlist)
module.exports=router
