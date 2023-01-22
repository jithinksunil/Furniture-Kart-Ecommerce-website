const express=require('express')
const router=express.Router()
const cartController=require('../controllers/cartController')
const userSession = require('../middlewares/userSessionMW')
const userSessionMW=userSession.userSession
const userSessionMWForAjax=userSession.userSessionForAjax

router.get('/',userSessionMW,cartController.userCart)
router.get('/addtocart',userSessionMWForAjax,cartController.userAddToCart)
router.get('/removeitem',userSessionMW,cartController.removeFromCart)

module.exports=router