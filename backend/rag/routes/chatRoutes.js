/**
 * Chat Routes
 * Routes for the RAG-powered AI chat assistant.
 */

const express = require('express');
const router = express.Router();
const { chat, chatStream, status } = require('../controllers/chatController');

// POST /api/chat - Send a message to the AI assistant
router.post('/', chat);

// POST /api/chat/stream - Stream a response via SSE
router.post('/stream', chatStream);

// GET /api/chat/status - Check RAG system health
router.get('/status', status);

module.exports = router;
