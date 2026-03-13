/**
 * LLM Service
 * Handles communication with LLMs (primary: Groq API, fallback: Ollama local).
 * Supports both streaming and non-streaming responses.
 */

const Groq = require('groq-sdk');
const ragConfig = require('../config');

let groqClient = null;

function getGroqClient() {
  if (!groqClient && ragConfig.llm.primary.apiKey) {
    groqClient = new Groq({ apiKey: ragConfig.llm.primary.apiKey });
  }
  return groqClient;
}

/**
 * Send a chat completion request to the LLM.
 * Tries Groq first, falls back to Ollama if unavailable.
 *
 * @param {Array<{role: string, content: string}>} messages - Chat messages
 * @returns {Promise<string>} - The assistant's response text
 */
async function chatCompletion(messages) {
  // Try Groq first
  const groq = getGroqClient();
  if (groq) {
    try {
      return await groqCompletion(groq, messages);
    } catch (error) {
      console.warn('[RAG] Groq API failed, falling back to Ollama:', error.message);
    }
  }

  // Fallback to Ollama
  return ollamaCompletion(messages);
}

/**
 * Stream a chat completion response.
 * @param {Array} messages - Chat messages
 * @param {function} onChunk - Callback for each text chunk: (text: string) => void
 * @returns {Promise<string>} - Full response text
 */
async function chatCompletionStream(messages, onChunk) {
  const groq = getGroqClient();
  if (groq) {
    try {
      return await groqCompletionStream(groq, messages, onChunk);
    } catch (error) {
      console.warn('[RAG] Groq stream failed, falling back to Ollama:', error.message);
    }
  }

  return ollamaCompletionStream(messages, onChunk);
}

// --- Groq Implementation ---

async function groqCompletion(client, messages) {
  const { model, maxTokens, temperature } = ragConfig.llm.primary;
  const response = await client.chat.completions.create({
    model,
    messages,
    max_tokens: maxTokens,
    temperature,
  });
  return response.choices[0]?.message?.content || '';
}

async function groqCompletionStream(client, messages, onChunk) {
  const { model, maxTokens, temperature } = ragConfig.llm.primary;
  const stream = await client.chat.completions.create({
    model,
    messages,
    max_tokens: maxTokens,
    temperature,
    stream: true,
  });

  let fullResponse = '';
  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content || '';
    if (text) {
      fullResponse += text;
      onChunk(text);
    }
  }
  return fullResponse;
}

// --- Ollama Implementation ---

async function ollamaCompletion(messages) {
  const { baseUrl, model, maxTokens, temperature } = ragConfig.llm.fallback;

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      options: { num_predict: maxTokens, temperature },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama LLM error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.message?.content || '';
}

async function ollamaCompletionStream(messages, onChunk) {
  const { baseUrl, model, maxTokens, temperature } = ragConfig.llm.fallback;

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      options: { num_predict: maxTokens, temperature },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama stream error: ${response.status} ${response.statusText}`);
  }

  let fullResponse = '';
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const lines = decoder.decode(value, { stream: true }).split('\n').filter(Boolean);
    for (const line of lines) {
      try {
        const json = JSON.parse(line);
        const text = json.message?.content || '';
        if (text) {
          fullResponse += text;
          onChunk(text);
        }
      } catch {
        // skip malformed lines
      }
    }
  }

  return fullResponse;
}

module.exports = { chatCompletion, chatCompletionStream };
