const express = require('express');
const {
    getRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    getMyRestaurants
} = require('../controllers/restaurantController');
const { getPaymentSettings, updatePaymentSettings } = require('../controllers/paymentSettingsController');
const { protect, authorize } = require('../middleware/auth');

// We also need to map nested menu, team & table routing 
const menuRouter = require('./menu');
const teamRouter = require('./team');
const tableRouter = require('./tables');

const router = express.Router();

// Re-route into other resource routers for clean endpoints
// e.g. GET /api/restaurants/:restaurantId/menu
router.use('/:restaurantId/menu', menuRouter);
router.use('/:restaurantId/team', teamRouter);
router.use('/:restaurantId/tables', tableRouter);

router
    .route('/')
    .get(getRestaurants)
    .post(protect, authorize('RESTAURANT_OWNER', 'ADMIN'), createRestaurant);

router.route('/mine').get(protect, authorize('RESTAURANT_OWNER', 'ADMIN'), getMyRestaurants);

router
    .route('/:id')
    .get(getRestaurantById)
    .put(protect, authorize('RESTAURANT_OWNER', 'ADMIN'), updateRestaurant);

// Per-restaurant payment settings
// GET  /api/restaurants/:id/payment-settings  — public (checkout page)
// PUT  /api/restaurants/:id/payment-settings  — owner / admin only
router
    .route('/:id/payment-settings')
    .get(getPaymentSettings)
    .put(protect, authorize('RESTAURANT_OWNER', 'ADMIN'), updatePaymentSettings);

module.exports = router;
