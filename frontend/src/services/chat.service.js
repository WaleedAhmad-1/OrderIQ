import api from './api';

/**
 * Send a message to the RAG chat assistant.
 * @param {string} message - User's message
 * @param {Array} conversationHistory - Previous messages [{role, content}]
 * @param {object} userContext - Optional context like { city, area }
 * @returns {Promise<string>} - Assistant's reply
 */
export async function sendChatMessage(message, conversationHistory = [], userContext = {}) {
  const response = await api.post('/chat', {
    message,
    conversationHistory,
    userContext,
  });
  return response.data.data.reply;
}

/**
 * Check RAG system status.
 */
export async function getChatStatus() {
  const response = await api.get('/chat/status');
  return response.data.data;
}
