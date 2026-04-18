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

        // --- Validate restaurant exists and has digital payments configured ---
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId },
            include: { paymentSettings: true }
        });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found.'
            });
        }

        const paySettings = restaurant.paymentSettings;
        if (!paySettings || !paySettings.googlePayEnabled) {
            return res.status(400).json({
                success: false,
                message: 'Digital payments (Google Pay) are not enabled for this restaurant.'
            });
        }

        const isGpayConfigured = paySettings.googlePayMerchantId && paySettings.googlePayMerchantId.trim() !== "";
        if (!isGpayConfigured) {
            return res.status(400).json({
                success: false,
                message: 'Restaurant has not fully configured their digital wallet accounts.'
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

/**
 * @desc    Process a standalone Credit/Debit Card checkout
 * @route   POST /api/payments/card/process
 * @access  Private (CUSTOMER)
 */
exports.processCardCheckout = async (req, res) => {
    try {
        const { paymentToken, orderPayload } = req.body;

        if (!paymentToken) return res.status(400).json({ success: false, message: 'Payment token missing.' });
        if (!orderPayload || !orderPayload.restaurantId) return res.status(400).json({ success: false, message: 'Invalid order payload.' });

        // --- Validate restaurant & gateway config ---
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: orderPayload.restaurantId },
            include: { paymentSettings: true }
        });
        if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

        const paySettings = restaurant.paymentSettings;
        if (!paySettings || !paySettings.cardEnabled) {
            return res.status(400).json({ success: false, message: 'Card payments are not enabled for this restaurant.' });
        }

        if (!paySettings.gatewayPublicKey || paySettings.gatewayPublicKey.trim() === "" || !paySettings.gatewaySecretKey || paySettings.gatewaySecretKey.trim() === "") {
            return res.status(400).json({ success: false, message: 'Restaurant gateway not fully configured.' });
        }

        // --- Create Order ---
        const orderItemsData = orderPayload.items.map(item => ({
            menuItemId: item.menuItemId,
            name: item.name,
            quantity: item.quantity,
            price: parseFloat(item.price),
            modifiers: item.modifiers || null
        }));

        const order = await prisma.order.create({
            data: {
                orderNumber: generateOrderNumber(),
                restaurantId: orderPayload.restaurantId,
                customerId: req.user.id,
                type: orderPayload.type,
                table: orderPayload.type === 'DINEIN' ? orderPayload.table : null,
                subtotal: parseFloat(orderPayload.subtotal),
                deliveryFee: parseFloat(orderPayload.deliveryFee) || 0,
                taxes: parseFloat(orderPayload.taxes) || 0,
                platformFee: parseFloat(orderPayload.platformFee) || 0,
                total: parseFloat(orderPayload.total),
                deliveryAddress: orderPayload.deliveryAddress ? JSON.stringify(orderPayload.deliveryAddress) : null,
                customerNotes: orderPayload.customerNotes || null,
                paymentMethod: 'CARD', // Maps to the CARD gateway
                paymentStatus: 'COMPLETED',
                items: { create: orderItemsData }
            },
            include: {
                items: true,
                restaurant: { select: { name: true, logo: true } },
                customer: { select: { fullName: true, phone: true } }
            }
        });

        // --- Socket Emit ---
        const io = req.app.get('io');
        if (io) io.to(`restaurant_${orderPayload.restaurantId}`).emit('newOrder', order);

        return res.status(201).json({
            success: true,
            message: 'Card payment processed successfully (TEST).',
            data: order
        });

    } catch (error) {
        console.error('[PaymentController] processCardCheckout error:', error);
        return res.status(500).json({ success: false, message: 'Server error processing card payment.' });
    }
};
