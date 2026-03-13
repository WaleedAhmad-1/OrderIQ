/**
 * Embedding Service
 * Generates vector embeddings using Ollama's nomic-embed-text model.
 * Also handles text chunk generation from database records.
 */

const ragConfig = require('../config');

/**
 * Generate embedding vector for a given text using Ollama.
 * @param {string} text - The text to embed
 * @returns {Promise<number[]>} - Array of floats (768 dimensions)
 */
async function generateEmbedding(text) {
  const { baseUrl, model } = ragConfig.embedding;

  const response = await fetch(`${baseUrl}/api/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt: text }),
  });

  if (!response.ok) {
    throw new Error(`Ollama embedding error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.embedding;
}

/**
 * Build a descriptive text chunk for a restaurant record.
 * This is the text that gets embedded into the vector store.
 */
function buildRestaurantChunk(restaurant) {
  const services = [];
  if (restaurant.dineIn) services.push('dine-in');
  if (restaurant.takeaway) services.push('takeaway');
  if (restaurant.delivery) services.push('delivery');

  return [
    `${restaurant.name} is a ${restaurant.businessType || 'restaurant'} located in ${restaurant.area}, ${restaurant.city}.`,
    restaurant.cuisineTypes?.length ? `Cuisines: ${restaurant.cuisineTypes.join(', ')}.` : '',
    `Rating: ${restaurant.rating}/5 (${restaurant.reviewCount} reviews).`,
    `Price range: ${restaurant.priceRange}. Hours: ${restaurant.openingTime} - ${restaurant.closingTime}.`,
    services.length ? `Services: ${services.join(', ')}.` : '',
    restaurant.description ? `Description: ${restaurant.description}` : '',
    restaurant.status !== 'OPEN' ? `Currently ${restaurant.status.toLowerCase()}.` : '',
  ].filter(Boolean).join(' ');
}

/**
 * Build a descriptive text chunk for a menu item record.
 */
function buildMenuItemChunk(menuItem, restaurant, category) {
  return [
    `${menuItem.name} at ${restaurant.name} (${restaurant.area}, ${restaurant.city}).`,
    menuItem.description ? `Description: ${menuItem.description}.` : '',
    `Price: Rs.${menuItem.price}.`,
    category ? `Category: ${category.name}.` : '',
    menuItem.badge ? `Badge: ${menuItem.badge}.` : '',
    !menuItem.inStock ? 'Currently out of stock.' : '',
  ].filter(Boolean).join(' ');
}

module.exports = {
  generateEmbedding,
  buildRestaurantChunk,
  buildMenuItemChunk,
};
