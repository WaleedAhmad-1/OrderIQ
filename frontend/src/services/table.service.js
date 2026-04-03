import api from './api';

export const tableService = {
    // Get all tables for a restaurant (public)
    getTables: async (restaurantId) => {
        const response = await api.get(`/restaurants/${restaurantId}/tables`);
        return response.data;
    },

    // Create a new table (protected)
    createTable: async (restaurantId, tableData) => {
        const response = await api.post(`/restaurants/${restaurantId}/tables`, tableData);
        return response.data;
    },

    // Update a table (protected)
    updateTable: async (restaurantId, tableId, tableData) => {
        const response = await api.put(`/restaurants/${restaurantId}/tables/${tableId}`, tableData);
        return response.data;
    },

    // Delete a table (protected)
    deleteTable: async (restaurantId, tableId) => {
        const response = await api.delete(`/restaurants/${restaurantId}/tables/${tableId}`);
        return response.data;
    },
};
