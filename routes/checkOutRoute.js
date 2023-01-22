const express=require('express')
const router=express.Router()
const checkoutController=require('../controllers/checkOutController')
const userSession = require('../middlewares/userSessionMW')
const userSessionMW=userSession.userSession
const userSessionMWForAjax=userSession.userSessionForAjax

router.get('/',userSessionMW,checkoutController.checkOut)
router.get('/delete/address',userSessionMW,checkoutController.deleteAddress)
router.post('/add/address',userSessionMW,checkoutController.addAddress)
router.get('/coupon/applied',checkoutController.couponApply)

module.exports=router