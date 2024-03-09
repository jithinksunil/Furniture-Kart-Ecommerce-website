const express = require('express');
const router = express.Router();
const productController = require('../controllers/productPageController');
const { categoriesPage, productPage } = productController;

router.get('/productpage/:productid', productPage);
router.get('/categories/:category', categoriesPage);

module.exports = router;
