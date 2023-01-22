const express=require('express')
const router=express.Router()
const wishlistController=require('../controllers/wishlistController')
const userSession = require('../middlewares/userSessionMW')
const userSessionMW=userSession.userSession
const userSessionMWForAjax=userSession.userSessionForAjax

router.get('/',userSessionMW,wishlistController.userWishlist)
router.get('/addtowishlist',userSessionMWForAjax,wishlistController.userAddToWishlist)
router.get('/removeitem',userSessionMW,wishlistController.removeFromWishlist)

module.exports=router