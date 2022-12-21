const express=require('express')
const router=express.Router()
const adminCollection=require('../models/adminSchema')
const adminController=require('../controllers/adminController')
const upload = require('../config/multerConfiguration')
const catUpload=upload.uploadCategories
const productUpload=upload.uploadProducts

router.get('/admin/login',adminController.adminLogin)
router.post('/admin/login/validation',adminController.adminLoginValidation)
router.get('/admin/dashboard',adminController.adminDashBoard)
router.get('/admin/usermangement',adminController.userManagement)
router.get('/admin/usermangement/blockuser',adminController.blockUser)
router.get('/admin/usermangement/unblockuser',adminController.unBlockUser)
router.get('/admin/products/categorymangement',adminController.categoryManagement)
router.post('/admin/products/categorymangement/add',catUpload.single('catImage'),adminController.addCategory)
router.get('/admin/products/categorymangement/listaction',adminController.listCategoryAction)
router.get('/admin/products/categorymangement/un-listaction',adminController.unListCategoryAction)
router.get('/admin/products/productmangement',adminController.productManagement)
router.get('/admin/products/productmangement/addproduct',adminController.productAddPage)
router.post('/admin/products/productmangement/addproduct/completed',productUpload.single('poductImage'),adminController.addProductCompleted)
router.get('/admin/products/productmangement/listaction',adminController.listProductAction)
router.get('/admin/products/productmangement/un-listaction',adminController.unListProductAction)
router.get('/admin/orders',adminController.orderManagement)
router.get('/admin/coupons',adminController.couponManagement)
module.exports=router

