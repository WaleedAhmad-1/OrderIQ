/**
 * Vector Store Service
 * Manages storing and querying vector embeddings using pgvector in PostgreSQL.
 * Uses raw SQL via Prisma since Prisma doesn't natively support vector types.
 */

const prisma = require('../../config/db');
const ragConfig = require('../config');
const { generateEmbedding } = require('./embeddingService');

/**
 * Ensure the vector store table and index exist.
 * Call this once at startup.
 */
async function initVectorStore() {
  const dim = ragConfig.embedding.dimensions;

  await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS vector`);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "rag_embeddings" (
      "id"             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "source_type"    TEXT NOT NULL,
      "source_id"      TEXT NOT NULL,
      "content"        TEXT NOT NULL,
      "restaurant_id"  TEXT,
      "city"           TEXT,
      "area"           TEXT,
      "cuisine_types"  TEXT[] DEFAULT '{}',
      "embedding"      vector(${dim}),
      "created_at"     TIMESTAMPTZ DEFAULT NOW(),
      "updated_at"     TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // Create indexes for fast similarity search and lookups
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "idx_rag_emb_hnsw"
    ON "rag_embeddings" USING hnsw ("embedding" vector_cosine_ops)
  `);
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "idx_rag_emb_source"
    ON "rag_embeddings" ("source_type", "source_id")
  `);

  console.log('[RAG] Vector store initialized');
}

/**
 * Upsert an embedding for a given source record.
 * If an embedding for this source already exists, update it.
 */
async function upsertEmbedding({ sourceType, sourceId, content, restaurantId, city, area, cuisineTypes }) {
  const vector = await generateEmbedding(content);
  const vectorStr = `[${vector.join(',')}]`;
  const cuisineArr = cuisineTypes || [];

  // Delete existing embedding for this source
  await prisma.$executeRawUnsafe(
    `DELETE FROM "rag_embeddings" WHERE "source_type" = $1 AND "source_id" = $2`,
    sourceType, sourceId
  );

  // Insert new embedding
  await prisma.$executeRawUnsafe(
    `INSERT INTO "rag_embeddings" ("source_type", "source_id", "content", "restaurant_id", "city", "area", "cuisine_types", "embedding")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8::vector)`,
    sourceType, sourceId, content, restaurantId || null, city || null, area || null, cuisineArr, vectorStr
  );
}

/**
 * Delete embedding(s) for a given source record.
 */
async function deleteEmbedding(sourceType, sourceId) {
  await prisma.$executeRawUnsafe(
    `DELETE FROM "rag_embeddings" WHERE "source_type" = $1 AND "source_id" = $2`,
    sourceType, sourceId
  );
}

/**
 * Perform a vector similarity search.
 *
 * @param {string} queryText - The user's natural language query
 * @param {object} filters - Optional filters { city, area, cuisineType, sourceType }
 * @returns {Promise<Array>} - Matching documents sorted by similarity
 */
async function similaritySearch(queryText, filters = {}) {
  const queryVector = await generateEmbedding(queryText);
  const vectorStr = `[${queryVector.join(',')}]`;
  const { topK, similarityThreshold } = ragConfig.vectorSearch;

  // Build WHERE clause dynamically
  const conditions = [`1 - ("embedding" <=> $1::vector) >= ${similarityThreshold}`];
  const params = [vectorStr];
  let paramIdx = 2;

  if (filters.city) {
    conditions.push(`LOWER("city") = LOWER($${paramIdx})`);
    params.push(filters.city);
    paramIdx++;
  }

  if (filters.area) {
    conditions.push(`LOWER("area") = LOWER($${paramIdx})`);
    params.push(filters.area);
    paramIdx++;
  }

  if (filters.cuisineType) {
    conditions.push(`$${paramIdx} = ANY("cuisine_types")`);
    params.push(filters.cuisineType);
    paramIdx++;
  }

  if (filters.sourceType) {
    conditions.push(`"source_type" = $${paramIdx}`);
    params.push(filters.sourceType);
    paramIdx++;
  }

  const whereClause = conditions.join(' AND ');

  const results = await prisma.$queryRawUnsafe(
    `SELECT "id", "source_type", "source_id", "content", "restaurant_id", "city", "area", "cuisine_types",
            1 - ("embedding" <=> $1::vector) AS similarity
     FROM "rag_embeddings"
     WHERE ${whereClause}
     ORDER BY similarity DESC
     LIMIT ${topK}`,
    ...params
  );

  return results;
}

/**
 * Get total count of embeddings in the store.
 */
async function getEmbeddingCount() {
  const result = await prisma.$queryRawUnsafe(
    `SELECT COUNT(*)::int as count FROM "rag_embeddings"`
  );
  return result[0]?.count || 0;
}

module.exports = {
  initVectorStore,
  upsertEmbedding,
  deleteEmbedding,
  similaritySearch,
  getEmbeddingCount,
};
