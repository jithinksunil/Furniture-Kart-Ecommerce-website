const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const userSession = require('../middlewares/userSessionMW');
const userSessionMW = userSession.userSession;
const {
  onlinePaymentCancel,
  onlinePaymentGateWay,
  onlinePaymentSuccess,
  order,
  orderCompleted,
} = orderController;

router.use(userSessionMW);
router.post('/', order);
router.get('/completed', orderCompleted);
router.get('/onlinepayment/gateway', onlinePaymentGateWay);
router.get('/onlinepayment/success', onlinePaymentSuccess);
router.get('/onlinepayment/cancel', onlinePaymentCancel);

module.exports = router;
