/**
 * RAG Module Entry Point
 * Initializes the vector store and exports the router + sync hooks.
 *
 * Usage in server.js:
 *   const rag = require('./rag');
 *   rag.initialize();
 *   app.use('/api/chat', rag.routes);
 */

const { initVectorStore } = require('./services/vectorStoreService');
const chatRoutes = require('./routes/chatRoutes');
const syncService = require('./services/syncService');

/**
 * Initialize the RAG module (call once at server startup).
 * Creates the vector store table/indexes if they don't exist.
 */
async function initialize() {
  try {
    await initVectorStore();
    console.log('[RAG] Module initialized successfully');
  } catch (error) {
    console.error('[RAG] Initialization failed:', error.message);
    console.error('[RAG] Chat features will be unavailable');
  }
}

module.exports = {
  initialize,
  routes: chatRoutes,
  sync: syncService,
};
