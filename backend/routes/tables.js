const express = require('express');
const {
    createTable,
    getTables,
    updateTable,
    deleteTable
} = require('../controllers/tableController');
const { protect, authorize } = require('../middleware/auth');

// mergeParams: true allows us to access :restaurantId from the parent router
const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(getTables) // Public — needed for QR page to verify tables
    .post(protect, authorize('RESTAURANT_OWNER', 'ADMIN'), createTable);

router
    .route('/:tableId')
    .put(protect, authorize('RESTAURANT_OWNER', 'ADMIN'), updateTable)
    .delete(protect, authorize('RESTAURANT_OWNER', 'ADMIN'), deleteTable);

module.exports = router;
