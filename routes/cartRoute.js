const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const userSession = require('../middlewares/userSessionMW');
const userSessionMW = userSession.userSession;
const userSessionMWForAjax = userSession.userSessionForAjax;
const { removeFromCart, userAddToCart, userCart } = cartController;

router.get('/addtocart', userSessionMWForAjax, userAddToCart);

router.use(userSessionMW);
router.get('/', userCart);
router.get('/removeitem', removeFromCart);

module.exports = router;
