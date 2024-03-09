const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const userSession = require('../middlewares/userSessionMW');
const userSessionMW = userSession.userSession;
const userSessionMWForAjax = userSession.userSessionForAjax;
const { removeFromWishlist, userAddToWishlist, userWishlist } =
  wishlistController;

router.get('/addtowishlist', userSessionMWForAjax, userAddToWishlist);

router.use(userSessionMW);
router.get('/', userWishlist);
router.get('/removeitem', removeFromWishlist);

module.exports = router;
