const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");
const { authUserMiddleware } = require("../middleware/authMiddleware");


router.post('/create-order', authUserMiddleware, orderController.createOrder)
router.get('/get-all-order/:id', authUserMiddleware, orderController.getALLOrderDetails)
router.get('/get-detail-order/:id', authUserMiddleware, orderController.getDetailsOrder)
router.delete('/cancel-order/:id', authUserMiddleware, orderController.cancelDetailsOrder)



module.exports = router