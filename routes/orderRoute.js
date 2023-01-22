const express=require('express')
const router=express.Router()
const orderController=require('../controllers/orderController')
const userSession = require('../middlewares/userSessionMW')
const userSessionMW=userSession.userSession

router.post('/',userSessionMW,orderController.order)
router.get('/completed',userSessionMW,orderController.orderCompleted)
router.get('/onlinepayment/gateway',userSessionMW,orderController.onlinePaymentGateWay)
router.get('/onlinepayment/success',userSessionMW,orderController.onlinePaymentSuccess)
router.get('/onlinepayment/cancel',userSessionMW,orderController.onlinePaymentCancel)

module.exports=router