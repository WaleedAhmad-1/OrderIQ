/**
 * Chat Controller
 * Handles the /api/chat endpoint for the RAG-powered AI assistant.
 */

const { processQuery, processQueryStream } = require('../services/ragPipeline');
const { getEmbeddingCount } = require('../services/vectorStoreService');

/**
 * POST /api/chat
 * Process a chat message through the RAG pipeline.
 *
 * Body: { message: string, conversationHistory?: [{role, content}], userContext?: {city, area} }
 * Response: { success: true, data: { reply: string } }
 */
exports.chat = async (req, res) => {
  try {
    const { message, conversationHistory, userContext } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const reply = await processQuery(
      message.trim(),
      conversationHistory || [],
      userContext || {},
    );

    res.status(200).json({ success: true, data: { reply } });
  } catch (error) {
    console.error('[RAG Chat] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to process your message. Please try again.' });
  }
};

/**
 * POST /api/chat/stream
 * Stream a chat response using Server-Sent Events (SSE).
 */
exports.chatStream = async (req, res) => {
  try {
    const { message, conversationHistory, userContext } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Set SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    await processQueryStream(
      message.trim(),
      conversationHistory || [],
      userContext || {},
      (chunk) => {
        res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      },
    );

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('[RAG Chat Stream] Error:', error);
    // If headers already sent, just end the stream
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: 'Stream error occurred' })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ success: false, message: 'Failed to process your message.' });
    }
  }
};

/**
 * GET /api/chat/status
 * Check if the RAG system is operational.
 */
exports.status = async (req, res) => {
  try {
    const embeddingCount = await getEmbeddingCount();

    // Check Ollama connectivity
    let ollamaReady = false;
    try {
      const resp = await fetch('http://localhost:11434/api/tags');
      ollamaReady = resp.ok;
    } catch { /* Ollama not running */ }

    res.status(200).json({
      success: true,
      data: {
        status: embeddingCount > 0 && ollamaReady ? 'ready' : 'degraded',
        embeddingCount,
        ollamaReady,
        groqConfigured: !!process.env.GROQ_API_KEY,
      },
    });
  } catch (error) {
    console.error('[RAG Status] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to check RAG status' });
  }
};
