/**
 * Embedding Sync Service
 * Automatically syncs embeddings when restaurant/menu data changes.
 * Called from controllers after create/update/delete operations.
 */

const prisma = require('../../config/db');
const { upsertEmbedding, deleteEmbedding } = require('./vectorStoreService');
const { buildRestaurantChunk, buildMenuItemChunk } = require('./embeddingService');

/**
 * Sync embedding for a single restaurant.
 */
async function syncRestaurantEmbedding(restaurantId) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });
    if (!restaurant) return;

    const content = buildRestaurantChunk(restaurant);
    await upsertEmbedding({
      sourceType: 'restaurant',
      sourceId: restaurant.id,
      content,
      restaurantId: restaurant.id,
      city: restaurant.city,
      area: restaurant.area,
      cuisineTypes: restaurant.cuisineTypes,
    });

    console.log(`[RAG Sync] Restaurant embedding updated: ${restaurant.name}`);
  } catch (error) {
    console.error(`[RAG Sync] Failed to sync restaurant ${restaurantId}:`, error.message);
  }
}

/**
 * Sync embedding for a single menu item.
 */
async function syncMenuItemEmbedding(menuItemId) {
  try {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
      include: {
        restaurant: true,
        category: true,
      },
    });
    if (!menuItem) return;

    const content = buildMenuItemChunk(menuItem, menuItem.restaurant, menuItem.category);
    await upsertEmbedding({
      sourceType: 'menu_item',
      sourceId: menuItem.id,
      content,
      restaurantId: menuItem.restaurantId,
      city: menuItem.restaurant.city,
      area: menuItem.restaurant.area,
      cuisineTypes: menuItem.restaurant.cuisineTypes,
    });

    console.log(`[RAG Sync] Menu item embedding updated: ${menuItem.name}`);
  } catch (error) {
    console.error(`[RAG Sync] Failed to sync menu item ${menuItemId}:`, error.message);
  }
}

/**
 * Remove embedding when a record is deleted.
 */
async function removeEmbedding(sourceType, sourceId) {
  try {
    await deleteEmbedding(sourceType, sourceId);
    console.log(`[RAG Sync] Removed embedding: ${sourceType}/${sourceId}`);
  } catch (error) {
    console.error(`[RAG Sync] Failed to remove embedding ${sourceType}/${sourceId}:`, error.message);
  }
}

/**
 * Sync all embeddings for all restaurants and menu items.
 * Used as a one-time seed or periodic refresh.
 */
async function syncAllEmbeddings() {
  console.log('[RAG Sync] Starting full embedding sync...');

  const restaurants = await prisma.restaurant.findMany();
  for (const restaurant of restaurants) {
    await syncRestaurantEmbedding(restaurant.id);
  }
  console.log(`[RAG Sync] Synced ${restaurants.length} restaurant(s)`);

  const menuItems = await prisma.menuItem.findMany({
    include: { restaurant: true, category: true },
  });
  for (const item of menuItems) {
    const content = buildMenuItemChunk(item, item.restaurant, item.category);
    await upsertEmbedding({
      sourceType: 'menu_item',
      sourceId: item.id,
      content,
      restaurantId: item.restaurantId,
      city: item.restaurant.city,
      area: item.restaurant.area,
      cuisineTypes: item.restaurant.cuisineTypes,
    });
  }
  console.log(`[RAG Sync] Synced ${menuItems.length} menu item(s)`);

  console.log('[RAG Sync] Full sync complete!');
}

module.exports = {
  syncRestaurantEmbedding,
  syncMenuItemEmbedding,
  removeEmbedding,
  syncAllEmbeddings,
};
