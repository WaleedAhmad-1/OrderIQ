import api from './api';

/**
 * Service for handling file/image uploads
 */
export const uploadService = {
  /**
   * Upload an image to the backend.
   * Converts to a base64 data URL on the server.
   * @param {File} file The file object from an input
   * @returns {Promise<{url: string}>}
   */
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Check for success correctly based on backend response structure
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || 'Upload failed');
    }
  }
};
