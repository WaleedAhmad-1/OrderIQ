const prisma = require('../config/db');

// ---------------------------------------------------------------------------
// Helper — fetch or auto-create default settings for a restaurant
// ---------------------------------------------------------------------------
const getOrCreateSettings = async (restaurantId) => {
    return prisma.restaurantPaymentSettings.upsert({
        where: { restaurantId },
        create: {
            restaurantId,
            cashEnabled: true,
            googlePayEnabled: true,
            cardEnabled: false,
        },
        update: {}, // no-op if it already exists
    });
};

/**
 * @desc    Get payment settings for a specific restaurant (public)
 * @route   GET /api/restaurants/:id/payment-settings
 * @access  Public
 *
 * Used by the customer checkout page to know which methods are available
 * and the payout account details to display.
 */
exports.getPaymentSettings = async (req, res) => {
    try {
        const { id: restaurantId } = req.params;

        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId },
            select: { id: true },
        });
        if (!restaurant) {
            return res.status(404).json({ success: false, message: 'Restaurant not found.' });
        }

        const settings = await getOrCreateSettings(restaurantId);

        return res.status(200).json({ success: true, data: settings });
    } catch (error) {
        console.error('[PaymentSettings] getPaymentSettings error:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};

/**
 * @desc    Update payment settings for a restaurant (owner / admin only)
 * @route   PUT /api/restaurants/:id/payment-settings
 * @access  Private (RESTAURANT_OWNER | ADMIN)
 */
exports.updatePaymentSettings = async (req, res) => {
    try {
        const { id: restaurantId } = req.params;

        // Verify restaurant exists and caller owns it
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId },
            select: { id: true, ownerId: true },
        });
        if (!restaurant) {
            return res.status(404).json({ success: false, message: 'Restaurant not found.' });
        }
        if (restaurant.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'Not authorized.' });
        }

        // Whitelist all allowed fields
        const {
            // Method toggles
            cashEnabled,
            googlePayEnabled,
            cardEnabled,
            // Branding / UX
            merchantName,
            merchantNote,
            // Digital wallet account details
            googlePayMerchantId,
            gatewayPublicKey,
            gatewaySecretKey,
        } = req.body;

        const updateData = {};

        // -- Toggles
        if (cashEnabled !== undefined)      updateData.cashEnabled      = Boolean(cashEnabled);
        if (googlePayEnabled !== undefined) updateData.googlePayEnabled = Boolean(googlePayEnabled);
        if (cardEnabled !== undefined)      updateData.cardEnabled      = Boolean(cardEnabled);

        // -- Branding
        if (merchantName !== undefined)     updateData.merchantName     = merchantName     || null;
        if (merchantNote !== undefined)     updateData.merchantNote     = merchantNote     || null;

        // -- Digital wallet account details
        if (googlePayMerchantId !== undefined) updateData.googlePayMerchantId = googlePayMerchantId || null;

        // -- Gateway keys
        if (gatewayPublicKey !== undefined) updateData.gatewayPublicKey = gatewayPublicKey || null;
        if (gatewaySecretKey !== undefined) updateData.gatewaySecretKey = gatewaySecretKey || null;

        // Ensure at least one payment method stays enabled
        const current = await getOrCreateSettings(restaurantId);
        const merged = { ...current, ...updateData };
        if (!merged.cashEnabled && !merged.googlePayEnabled && !merged.cardEnabled) {
            return res.status(400).json({
                success: false,
                message: 'At least one payment method must remain enabled.',
            });
        }

        // --- NEW: Strict Validation for Enabling Methods ---
        if (merged.googlePayEnabled && (!merged.googlePayMerchantId || merged.googlePayMerchantId.trim() === "")) {
            return res.status(400).json({
                success: false,
                message: 'Google Pay cannot be enabled without a Merchant ID.',
            });
        }

        if (merged.cardEnabled && (!merged.gatewayPublicKey || merged.gatewayPublicKey.trim() === "" || !merged.gatewaySecretKey || merged.gatewaySecretKey.trim() === "")) {
            return res.status(400).json({
                success: false,
                message: 'Card payments cannot be enabled without both Public and Secret Gateway Keys.',
            });
        }

        const settings = await prisma.restaurantPaymentSettings.upsert({
            where: { restaurantId },
            create: { restaurantId, ...updateData },
            update: updateData,
        });

        return res.status(200).json({
            success: true,
            message: 'Payment settings updated.',
            data: settings,
        });
    } catch (error) {
        console.error('[PaymentSettings] updatePaymentSettings error:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};
