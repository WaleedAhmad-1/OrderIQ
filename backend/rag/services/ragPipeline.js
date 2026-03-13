/**
 * RAG Pipeline Service
 * Orchestrates the full Retrieval-Augmented Generation flow:
 *   User query → Embed → Vector search → Build prompt → LLM → Response
 */

const ragConfig = require('../config');
const { similaritySearch } = require('./vectorStoreService');
const { chatCompletion, chatCompletionStream } = require('./llmService');

/**
 * Process a user chat message through the RAG pipeline.
 *
 * @param {string} userMessage - The user's query
 * @param {Array} conversationHistory - Previous messages [{role, content}, ...]
 * @param {object} userContext - Optional user context { city, area }
 * @returns {Promise<string>} - The assistant's response
 */
async function processQuery(userMessage, conversationHistory = [], userContext = {}) {
  // Step 1: Retrieve relevant documents from vector store
  const retrievedDocs = await similaritySearch(userMessage, {
    city: userContext.city || undefined,
  });

  // Step 2: Build the context from retrieved documents
  const context = buildContext(retrievedDocs);

  // Step 3: Assemble the full message array for the LLM
  const messages = buildMessages(userMessage, context, conversationHistory);

  // Step 4: Get LLM response
  const response = await chatCompletion(messages);

  return response;
}

/**
 * Process a user query with streaming response.
 *
 * @param {string} userMessage
 * @param {Array} conversationHistory
 * @param {object} userContext
 * @param {function} onChunk - Callback for each text chunk
 * @returns {Promise<string>} - Full response text
 */
async function processQueryStream(userMessage, conversationHistory = [], userContext = {}, onChunk) {
  const retrievedDocs = await similaritySearch(userMessage, {
    city: userContext.city || undefined,
  });

  const context = buildContext(retrievedDocs);
  const messages = buildMessages(userMessage, context, conversationHistory);

  const response = await chatCompletionStream(messages, onChunk);
  return response;
}

/**
 * Format retrieved documents into a context string for the LLM.
 */
function buildContext(documents) {
  if (!documents || documents.length === 0) {
    return 'AVAILABLE DATA: (empty — no matching restaurants or items found)';
  }

  const entries = documents
    .map((doc, i) => `  ${i + 1}. [${doc.source_type.toUpperCase()}] ${doc.content}`)
    .join('\n');

  return `AVAILABLE DATA (ONLY use these — do NOT invent anything else):\n${entries}`;
}

/**
 * Build the full messages array for LLM chat completion.
 */
function buildMessages(userMessage, context, conversationHistory) {
  const systemMessage = {
    role: 'system',
    content: `${ragConfig.systemPrompt}\n\n${context}`,
  };

  // Keep last 6 messages from conversation history to stay within context limits
  const recentHistory = conversationHistory.slice(-6);

  return [
    systemMessage,
    ...recentHistory,
    { role: 'user', content: userMessage },
  ];
}

module.exports = { processQuery, processQueryStream };
