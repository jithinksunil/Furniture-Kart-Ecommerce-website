const express=require('express')
const router=express.Router()
const productController=require('../controllers/productPageController')
const userSession = require('../middlewares/userSessionMW')

router.get('/productpage/:productid',productController.productPage)
router.get('/categories/:category',productController.categoriesPage)

module.exports=router