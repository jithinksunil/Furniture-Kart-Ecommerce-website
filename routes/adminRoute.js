const express=require('express')
const router=express.Router()
const adminCollection=require('../models/adminSchema')
const adminController=require('../controllers/adminController')
const upload = require('../config/multerConfiguration')
const catUpload=upload.uploadCategories
const productUpload=upload.uploadProducts
const adminSession = require('../middlewares/adminSessionMW')
const adminSessionMW=adminSession.adminSession
const withOutAdminSessionMW=adminSession.withOutAdminSession

router.get('/login',withOutAdminSessionMW,adminController.adminLogin)
router.post('/login/validation',adminController.adminLoginValidation)
router.get('/dashboard',adminSessionMW,adminController.adminDashBoard)
router.get('/usermangement',adminSessionMW,adminController.userManagement)
router.get('/usermangement/blockuser',adminSessionMW,adminController.blockUser)
router.get('/usermangement/unblockuser',adminSessionMW,adminController.unBlockUser)
router.get('/products/categorymangement',adminSessionMW,adminController.categoryManagement)
router.post('/products/categorymangement/add',catUpload.single('catImage'),adminController.addCategory)
router.get('/products/categorymangement/listaction',adminSessionMW,adminController.listCategoryAction)
router.get('/products/categorymangement/un-listaction',adminSessionMW,adminController.unListCategoryAction)
router.get('/products/productmangement',adminSessionMW,adminController.productManagement)
router.get('/products/productmangement/addproduct',adminSessionMW,adminController.productAddPage)
router.post('/products/productmangement/addproduct/completed',productUpload.array('poductImage',4),adminController.addProductCompleted)
router.get('/products/productmangement/listaction',adminSessionMW,adminController.listProductAction)
router.get('/products/productmangement/un-listaction',adminSessionMW,adminController.unListProductAction)
router.get('/orders',adminSessionMW,adminController.orderManagement)
router.get('/orders/statuschange',adminController.orderStatusManagement)
router.get('/genarate/salesreport',adminSessionMW,adminController.salesReport)
router.get('/coupons',adminSessionMW,adminController.couponManagement)
router.get('/coupon/couponmangement/actions',adminSessionMW,adminController.couponListAndUnListActions)
router.get('/banners',adminSessionMW,adminController.bannerManagement)
router.get('/banners/blockbanner',adminSessionMW,adminController.blockBanner)
router.get('/banners/unblockbanner',adminSessionMW,adminController.unBlockBanner)
router.get('/logout',adminController.logOut)

module.exports=router

