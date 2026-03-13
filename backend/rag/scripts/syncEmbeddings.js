/**
 * Sync Embeddings Script
 * Generates vector embeddings for all existing restaurants and menu items.
 *
 * Usage: node rag/scripts/syncEmbeddings.js
 *
 * Prerequisites:
 *   - Ollama running with nomic-embed-text model pulled
 *   - Database populated with restaurant/menu data
 */

const { initVectorStore, getEmbeddingCount } = require('../services/vectorStoreService');
const { syncAllEmbeddings } = require('../services/syncService');

async function main() {
  console.log('=== OrderIQ Embedding Sync ===\n');

  // Check Ollama is running
  try {
    const resp = await fetch('http://localhost:11434/api/tags');
    if (!resp.ok) throw new Error('Not OK');
    console.log('[✓] Ollama is running');
  } catch {
    console.error('[✗] Ollama is not running. Start it with: ollama serve');
    process.exit(1);
  }

  // Initialize vector store table
  await initVectorStore();

  const beforeCount = await getEmbeddingCount();
  console.log(`[i] Existing embeddings: ${beforeCount}\n`);

  // Sync all embeddings
  await syncAllEmbeddings();

  const afterCount = await getEmbeddingCount();
  console.log(`\n[✓] Total embeddings now: ${afterCount}`);
  console.log('[✓] Done!');

  process.exit(0);
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
