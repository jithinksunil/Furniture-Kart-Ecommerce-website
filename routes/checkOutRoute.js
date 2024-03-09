const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkOutController');
const userSession = require('../middlewares/userSessionMW');
const userSessionMW = userSession.userSession;
const { addAddress, checkOut, couponApply, deleteAddress } = checkoutController;

router.use(userSessionMW);
router.get('/', checkOut);
router.get('/delete/address', deleteAddress);
router.post('/add/address', addAddress);
router.get('/coupon/applied', couponApply);

module.exports = router;
