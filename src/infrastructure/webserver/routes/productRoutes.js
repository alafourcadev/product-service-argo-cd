const express = require('express');
const ProductController = require('../controllers/ProductController');

const router = express.Router();

router.post('/products', ProductController.create);
router.get('/products/:id', ProductController.getById);
router.get('/products', ProductController.getAll);
router.put('/products/:id', ProductController.update);
router.delete('/products/:id', ProductController.delete);

module.exports = router;
