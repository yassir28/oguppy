import esClient from './client';
import { ITEMS_INDEX } from './indexMappings';
import prisma from '@/lib/prisma';

/**
 * Index a single item
 */
export async function indexItem(item) {
  try {
    await esClient.index({
      index: ITEMS_INDEX,
      id: item.id,
      document: {
        id: item.id,
        title: item.title,
        description: item.description,
        sku: item.sku,
        barcode: item.barcode,
        quantity: item.quantity,
        sellingPrice: item.sellingPrice,
        reOrderPoint: item.reOrderPoint,
        weight: item.weight,
        taxRate: item.taxRate,
        imageUrl: item.imageUrl,
        category: item.category ? {
          id: item.category.id,
          title: item.category.title
        } : null,
        warehouse: item.warehouse ? {
          id: item.warehouse.id,
          title: item.warehouse.title
        } : null,
        brand: item.brand ? {
          id: item.brand.id,
          title: item.brand.title
        } : null,
        supplier: item.supplier ? {
          id: item.supplier.id,
          title: item.supplier.title
        } : null,
        unit: item.unit ? {
          id: item.unit.id,
          title: item.unit.title
        } : null,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }
    });
    
    console.log(`✅ Indexed item: ${item.title}`);
  } catch (error) {
    console.error(`❌ Error indexing item ${item.id}:`, error.message);
    throw error;
  }
}

/**
 * Delete item from index
 */
export async function deleteItemFromIndex(itemId) {
  try {
    await esClient.delete({
      index: ITEMS_INDEX,
      id: itemId
    });
    console.log(`✅ Deleted item from index: ${itemId}`);
  } catch (error) {
    if (error.meta?.body?.result !== 'not_found') {
      console.error(`❌ Error deleting item ${itemId}:`, error.message);
    }
  }
}

/**
 * Bulk index all items from PostgreSQL
 */
export async function bulkIndexItems() {
  try {
    console.log('📥 Fetching all items from PostgreSQL...');
    
    const items = await prisma.item.findMany({
      include: {
        category: true,
        warehouse: true,
        brand: true,
        supplier: true,
        unit: true
      }
    });
    
    console.log(`📦 Found ${items.length} items to index`);
    
    if (items.length === 0) {
      console.log('ℹ️ No items to index');
      return;
    }
    
    // Prepare bulk operations
    const operations = items.flatMap(item => [
      { index: { _index: ITEMS_INDEX, _id: item.id } },
      {
        id: item.id,
        title: item.title,
        description: item.description,
        sku: item.sku,
        barcode: item.barcode,
        quantity: item.quantity,
        sellingPrice: item.sellingPrice,
        reOrderPoint: item.reOrderPoint,
        weight: item.weight,
        taxRate: item.taxRate,
        imageUrl: item.imageUrl,
        category: item.category ? {
          id: item.category.id,
          title: item.category.title
        } : null,
        warehouse: item.warehouse ? {
          id: item.warehouse.id,
          title: item.warehouse.title
        } : null,
        brand: item.brand ? {
          id: item.brand.id,
          title: item.brand.title
        } : null,
        supplier: item.supplier ? {
          id: item.supplier.id,
          title: item.supplier.title
        } : null,
        unit: item.unit ? {
          id: item.unit.id,
          title: item.unit.title
        } : null,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }
    ]);
    
    // Execute bulk operation
    const result = await esClient.bulk({
      operations,
      refresh: true
    });
    
    if (result.errors) {
      console.error('❌ Bulk indexing had errors');
      result.items.forEach((item, i) => {
        if (item.index?.error) {
          console.error(`Error on item ${i}:`, item.index.error);
        }
      });
    } else {
      console.log(`✅ Successfully indexed ${items.length} items`);
    }
    
  } catch (error) {
    console.error('❌ Error in bulk indexing:', error.message);
    throw error;
  }
}