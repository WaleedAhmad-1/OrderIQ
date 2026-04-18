import api from './api';

export const paymentService = {
    /**
     * Process a Google Pay payment in TEST mode.
     * Sends the paymentToken received from Google Pay JS API + the full order payload.
     * Backend creates the order with paymentStatus = COMPLETED.
     *
     * @param {object} payload - { paymentToken, orderPayload }
     * @returns {Promise} - API response containing the created order
     */
    processGooglePay: async (payload) => {
        const response = await api.post('/payments/gpay/process', payload);
        return response.data;
    },

    /**
     * Process a Secure Card payment in TEST mode.
     * @param {object} payload - { paymentToken, orderPayload }
     */
    processCardPayment: async (payload) => {
        const response = await api.post('/payments/card/process', payload);
        return response.data;
    },

    /**
     * Fetch payment status for a given order.
     * @param {string} orderId
     */
    getPaymentStatus: async (orderId) => {
        const response = await api.get(`/payments/status/${orderId}`);
        return response.data;
    },

    /**
     * Get the payment settings for a specific restaurant (public).
     * Returns which methods (cash, gpay, card) are enabled.
     * @param {string} restaurantId
     */
    getRestaurantPaymentSettings: async (restaurantId) => {
        const response = await api.get(`/restaurants/${restaurantId}/payment-settings`);
        return response.data;
    },

    /**
     * Update payment settings for a restaurant (owner only).
     * @param {string} restaurantId
     * @param {object} data - { cashEnabled, googlePayEnabled, cardEnabled, merchantName, merchantNote }
     */
    updatePaymentSettings: async (restaurantId, data) => {
        const response = await api.put(`/restaurants/${restaurantId}/payment-settings`, data);
        return response.data;
    },
};

