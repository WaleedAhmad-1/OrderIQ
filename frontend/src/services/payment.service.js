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
     * Fetch payment status for a given order.
     * @param {string} orderId
     */
    getPaymentStatus: async (orderId) => {
        const response = await api.get(`/payments/status/${orderId}`);
        return response.data;
    }
};
