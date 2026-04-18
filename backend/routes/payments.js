const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { processGooglePay, processCardCheckout, getPaymentStatus } = require('../controllers/paymentController');

// POST /api/payments/gpay/process
// Process a Google Pay payment token and create the order
router.post('/gpay/process', protect, processGooglePay);

// POST /api/payments/card/process
// Process a Card checkout payment token and create the order
router.post('/card/process', protect, processCardCheckout);

// GET /api/payments/status/:orderId
// Get payment status for a specific order
router.get('/status/:orderId', protect, getPaymentStatus);

module.exports = router;
