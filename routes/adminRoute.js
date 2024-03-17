const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfiguration');
const catUpload = upload.uploadCategories;
const productUpload = upload.uploadProducts;
const bannerUpload = upload.uploadbanners;
const {
  adminSession: adminSessionMW,
  withOutAdminSession: withOutAdminSessionMW,
} = require('../middlewares/adminSessionMW');
const {
  addBanner,
  addCategory,
  addCouponCompleted,
  addProductCompleted,
  adminDashBoard,
  adminLogin,
  adminLoginValidation,
  bannerManagement,
  blockBanner,
  blockUser,
  categoryManagement,
  couponListAndUnListActions,
  couponManagement,
  listCategoryAction,
  listProductAction,
  logOut,
  orderManagement,
  unBlockBanner,
  orderStatusManagement,
  productAddPage,
  productManagement,
  salesReport,
  unBlockUser,
  unListCategoryAction,
  unListProductAction,
  userManagement,
} = require('../controllers/adminController');

router.get('/logout', logOut);
router.post('/login/validation', adminLoginValidation);
router.get('/login', withOutAdminSessionMW, adminLogin);

router.use(adminSessionMW);
router.get('/dashboard', adminDashBoard);
router.get('/usermangement', userManagement);
router.get('/usermangement/blockuser', blockUser);
router.get('/usermangement/unblockuser', unBlockUser);
router.get('/products/categorymangement', categoryManagement);
router.post(
  '/products/categorymangement/add',
  catUpload.single('catImage'),
  addCategory
);
router.get('/products/categorymangement/listaction', listCategoryAction);
router.get('/products/categorymangement/un-listaction', unListCategoryAction);
router.get('/products/productmangement', productManagement);
router.get('/products/productmangement/addproduct', productAddPage);
router.post(
  '/products/productmangement/addproduct/completed',
  productUpload.array('poductImage', 4),
  addProductCompleted
);
router.get('/products/productmangement/listaction', listProductAction);
router.get('/products/productmangement/un-listaction', unListProductAction);
router.get('/orders/statuschange', orderStatusManagement);
router.get('/orders', orderManagement);
router.get('/genarate/salesreport', salesReport);
router.get('/coupons', couponManagement);
router.post('/coupon/add', addCouponCompleted);

router.get('/coupon/couponmangement/actions', couponListAndUnListActions);
router.get('/banners', bannerManagement);
router.post('/banner/add', bannerUpload.single('bannerFile'), addBanner);
router.get('/banners/blockbanner', blockBanner);
router.get('/banners/unblockbanner', unBlockBanner);

module.exports = router;
