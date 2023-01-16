const express=require('express')
const router=express.Router()
const userController=require('../controllers/userController')
const cartController=require('../controllers/cartController')
const wishlistController=require('../controllers/wishlistController')
const productController=require('../controllers/productPageController')
const checkoutController=require('../controllers/checkOutController')
const orderController=require('../controllers/orderController')
const userSession = require('../middlewares/userSessionMW')
const userSessionMW=userSession.userSession
const userSessionMWForAjax=userSession.userSessionForAjax
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
router.get('/user/categories/:category/:page',userController.categoriesPage)
router.get('/productpage/:productid',productController.productPage)


router.get('/user/cart',userSessionMW,cartController.userCart)
router.get('/user/addtocart',userSessionMWForAjax,cartController.userAddToCart)
router.get('/user/cart/removeitem',userSessionMW,cartController.removeFromCart)

router.get('/user/wishlist',userSessionMW,wishlistController.userWishlist)
router.get('/user/addtowishlist',userSessionMWForAjax,wishlistController.userAddToWishlist)
router.get('/user/wishlist/removeitem',userSessionMW,wishlistController.removeFromWishlist)

router.get('/user/checkout',userSessionMW,checkoutController.checkOut)
router.get('/coupon/applied',checkoutController.couponApply)
router.post('/user/order',userSessionMW,orderController.order)
router.get('/oder/completed',userSessionMW,orderController.orderCompleted)
router.get('/onlinepayment/gateway',userSessionMW,orderController.onlinePaymentGateWay)
router.get('/onlinepayment/success',userSessionMW,orderController.onlinePaymentSuccess)
router.get('/onlinepayment/cancel',userSessionMW,orderController.onlinePaymentCancel)

module.exports=router
