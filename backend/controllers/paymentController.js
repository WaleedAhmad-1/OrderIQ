const prisma = require('../config/db');

// Helper to generate order numbers
const generateOrderNumber = () => {
    return `#ORD-${Math.floor(100000 + Math.random() * 900000)}`;
};

/**
 * @desc    Process a Google Pay payment (TEST MODE) and create the order
 * @route   POST /api/payments/gpay/process
 * @access  Private (CUSTOMER)
 *
 * In TEST mode, Google Pay returns a fake paymentToken.
 * We record it and immediately mark the order as paymentStatus = COMPLETED.
 * In production, you would send this token to a payment gateway
 * (e.g. Stripe, Braintree) to charge the customer.
 */
exports.processGooglePay = async (req, res) => {
    try {
        const { paymentToken, orderPayload } = req.body;

        // --- Validate required fields ---
        if (!paymentToken) {
            console.error('[PaymentController] Missing paymentToken in body:', req.body);
            return res.status(400).json({
                success: false,
                message: 'Payment token is required.'
            });
        }

        if (!orderPayload) {
            console.error('[PaymentController] Missing orderPayload in body:', req.body);
            return res.status(400).json({
                success: false,
                message: 'Order payload is completely missing.'
            });
        }

        if (!orderPayload.restaurantId) {
            console.error('[PaymentController] Missing restaurantId in orderPayload:', orderPayload);
            return res.status(400).json({
                success: false,
                message: 'Restaurant ID is missing from the order payload.'
            });
        }

        if (!orderPayload.items || !orderPayload.items.length) {
            console.error('[PaymentController] Missing items in orderPayload:', orderPayload);
            return res.status(400).json({
                success: false,
                message: 'Order payload must include at least one item.'
            });
        }

        const {
            restaurantId, type, table, items, subtotal,
            deliveryFee, taxes, platformFee, total,
            deliveryAddress, customerNotes
        } = orderPayload;

        // --- Validate restaurant exists ---
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId }
        });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found.'
            });
        }

        // --- Map items for Prisma nested write ---
        const orderItemsData = items.map(item => ({
            menuItemId: item.menuItemId,
            name: item.name,
            quantity: item.quantity,
            price: parseFloat(item.price),
            modifiers: item.modifiers || null
        }));

        // --- Create order with GOOGLE_PAY + COMPLETED status ---
        // TEST MODE: We trust the token as valid since this is for demo/testing.
        // In production, verify the token with your payment gateway before marking COMPLETED.
        const order = await prisma.order.create({
            data: {
                orderNumber: generateOrderNumber(),
                restaurantId,
                customerId: req.user.id,
                type,
                table: type === 'DINEIN' ? table : null,
                subtotal: parseFloat(subtotal),
                deliveryFee: parseFloat(deliveryFee) || 0,
                taxes: parseFloat(taxes) || 0,
                platformFee: parseFloat(platformFee) || 0,
                total: parseFloat(total),
                deliveryAddress: deliveryAddress ? JSON.stringify(deliveryAddress) : null,
                customerNotes: customerNotes || null,
                paymentMethod: 'GOOGLE_PAY',
                paymentStatus: 'COMPLETED',   // Immediately completed in test mode
                items: {
                    create: orderItemsData
                }
            },
            include: {
                items: true,
                restaurant: { select: { name: true, logo: true } }
            }
        });

        // --- Refetch with customer info for Socket.IO emit ---
        const orderWithCustomer = await prisma.order.findUnique({
            where: { id: order.id },
            include: {
                items: true,
                restaurant: { select: { name: true, logo: true } },
                customer: { select: { fullName: true, phone: true } }
            }
        });

        // --- Socket.IO Real-time Emit to restaurant ---
        const io = req.app.get('io');
        if (io) {
            io.to(`restaurant_${restaurantId}`).emit('newOrder', orderWithCustomer);
        }

        // Log payment token for demo/audit purposes
        console.log(`[Google Pay TEST] Token received for order ${order.orderNumber}:`, {
            tokenPreview: JSON.stringify(paymentToken).slice(0, 100) + '...',
            orderId: order.id,
            amount: total,
            status: 'COMPLETED (TEST MODE)'
        });

        return res.status(201).json({
            success: true,
            message: 'Google Pay payment processed successfully (TEST MODE).',
            data: orderWithCustomer
        });

    } catch (error) {
        console.error('[PaymentController] processGooglePay error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Server error processing Google Pay payment.',
            errorDetails: process.env.NODE_ENV !== 'production' ? error : undefined
        });
    }
};

/**
 * @desc    Get payment status for an order
 * @route   GET /api/payments/status/:orderId
 * @access  Private
 */
exports.getPaymentStatus = async (req, res) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: req.params.orderId },
            select: {
                id: true,
                orderNumber: true,
                paymentMethod: true,
                paymentStatus: true,
                total: true,
                customerId: true
            }
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        // Only the customer who placed the order can check payment status
        if (order.customerId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'Not authorized.' });
        }

        return res.status(200).json({ success: true, data: order });

    } catch (error) {
        console.error('[PaymentController] getPaymentStatus error:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};
