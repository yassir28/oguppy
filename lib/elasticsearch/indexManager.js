import esClient from './client';
import { ITEMS_INDEX, itemsMapping } from './indexMappings';

/**
 * Create the items index
 */
export async function createItemsIndex() {
  try {
    const exists = await esClient.indices.exists({ index: ITEMS_INDEX });
    
    if (exists) {
      console.log(`ℹ️ Index ${ITEMS_INDEX} already exists`);
      return;
    }
    
    await esClient.indices.create({
      index: ITEMS_INDEX,
      body: itemsMapping
    });
    
    console.log(`✅ Index ${ITEMS_INDEX} created`);
  } catch (error) {
    console.error('❌ Error creating index:', error.message);
    throw error;
  }
}

/**
 * Delete the items index
 */
export async function deleteItemsIndex() {
  try {
    await esClient.indices.delete({ index: ITEMS_INDEX });
    console.log(`✅ Index ${ITEMS_INDEX} deleted`);
  } catch (error) {
    console.error('❌ Error deleting index:', error.message);
  }
}

/**
 * Refresh index (make changes searchable immediately)
 */
export async function refreshIndex() {
  try {
    await esClient.indices.refresh({ index: ITEMS_INDEX });
  } catch (error) {
    console.error('❌ Error refreshing index:', error.message);
  }
}