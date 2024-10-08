const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post('/create-product', ProductController.createProduct)
router.put('/update-product/:id', authMiddleware,ProductController.updateProduct)
router.get('/get-details/:id', ProductController.getDetailsProduct)
router.delete('/delete-product/:id',authMiddleware, ProductController.deleteProduct)
router.get('/getALL-product', ProductController.getAllProduct)
router.post('/delete-many', authMiddleware, ProductController.deleteMany)


module.exports  = router