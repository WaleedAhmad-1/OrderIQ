const prisma = require('../config/db');

// @desc    Create a new table for a restaurant
// @route   POST /api/restaurants/:restaurantId/tables
// @access  Private (RESTAURANT_OWNER)
exports.createTable = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const { label, capacity } = req.body;

        // Verify ownership
        const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
        if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });
        if (restaurant.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        if (!label || !label.trim()) {
            return res.status(400).json({ success: false, message: 'Table label is required' });
        }

        const table = await prisma.table.create({
            data: {
                restaurantId,
                label: label.trim(),
                capacity: capacity ? parseInt(capacity) : 4,
            }
        });

        res.status(201).json({ success: true, data: table });
    } catch (error) {
        // Handle unique constraint violation
        if (error.code === 'P2002') {
            return res.status(409).json({ success: false, message: `Table "${req.body.label}" already exists` });
        }
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error creating table' });
    }
};

// @desc    Get all tables for a restaurant
// @route   GET /api/restaurants/:restaurantId/tables
// @access  Public (so QR pages can verify table existence)
exports.getTables = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        const tables = await prisma.table.findMany({
            where: { restaurantId },
            orderBy: { createdAt: 'asc' }
        });

        res.status(200).json({ success: true, count: tables.length, data: tables });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error retrieving tables' });
    }
};

// @desc    Update a table
// @route   PUT /api/restaurants/:restaurantId/tables/:tableId
// @access  Private (RESTAURANT_OWNER)
exports.updateTable = async (req, res) => {
    try {
        const { restaurantId, tableId } = req.params;
        const { label, capacity, isActive } = req.body;

        // Verify ownership
        const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
        if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });
        if (restaurant.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const updateData = {};
        if (label !== undefined) updateData.label = label.trim();
        if (capacity !== undefined) updateData.capacity = parseInt(capacity);
        if (isActive !== undefined) updateData.isActive = isActive;

        const table = await prisma.table.update({
            where: { id: tableId },
            data: updateData,
        });

        res.status(200).json({ success: true, data: table });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ success: false, message: `Table "${req.body.label}" already exists` });
        }
        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, message: 'Table not found' });
        }
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error updating table' });
    }
};

// @desc    Delete a table
// @route   DELETE /api/restaurants/:restaurantId/tables/:tableId
// @access  Private (RESTAURANT_OWNER)
exports.deleteTable = async (req, res) => {
    try {
        const { restaurantId, tableId } = req.params;

        // Verify ownership
        const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
        if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });
        if (restaurant.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        await prisma.table.delete({ where: { id: tableId } });

        res.status(200).json({ success: true, message: 'Table deleted' });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, message: 'Table not found' });
        }
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error deleting table' });
    }
};
