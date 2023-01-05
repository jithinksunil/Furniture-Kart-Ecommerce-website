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

router.get('/admin/login',withOutAdminSessionMW,adminController.adminLogin)
router.post('/admin/login/validation',adminController.adminLoginValidation)
router.get('/admin/dashboard',adminSessionMW,adminController.adminDashBoard)
router.get('/admin/usermangement',adminSessionMW,adminController.userManagement)
router.get('/admin/usermangement/blockuser',adminSessionMW,adminController.blockUser)
router.get('/admin/usermangement/unblockuser',adminSessionMW,adminController.unBlockUser)
router.get('/admin/products/categorymangement',adminSessionMW,adminController.categoryManagement)
router.post('/admin/products/categorymangement/add',catUpload.single('catImage'),adminController.addCategory)
router.get('/admin/products/categorymangement/listaction',adminSessionMW,adminController.listCategoryAction)
router.get('/admin/products/categorymangement/un-listaction',adminSessionMW,adminController.unListCategoryAction)
router.get('/admin/products/productmangement',adminSessionMW,adminController.productManagement)
router.get('/admin/products/productmangement/addproduct',adminSessionMW,adminController.productAddPage)
router.post('/admin/products/productmangement/addproduct/completed',productUpload.single('poductImage'),adminController.addProductCompleted)
router.get('/admin/products/productmangement/listaction',adminSessionMW,adminController.listProductAction)
router.get('/admin/products/productmangement/un-listaction',adminSessionMW,adminController.unListProductAction)
router.get('/admin/orders',adminSessionMW,adminController.orderManagement)
router.get('/admin/genarate/salesreport',adminSessionMW,adminController.salesReport)
router.get('/admin/coupons',adminSessionMW,adminController.couponManagement)
router.get('/admin/coupon/couponmangement/actions',adminSessionMW,adminController.couponListAndUnListActions)
router.get('/admin/banners',adminSessionMW,adminController.bannerManagement)
router.get('/admin/banners/blockbanner',adminSessionMW,adminController.blockBanner)
router.get('/admin/banners/unblockbanner',adminSessionMW,adminController.unBlockBanner)
router.get('/admin/logout',adminController.logOut)
module.exports=router

