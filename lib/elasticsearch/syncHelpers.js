// lib/elasticsearch/syncHelpers.js
import esClient from './client';
import { ITEMS_INDEX } from './indexMappings';
import prisma from '@/lib/prisma';

/**
 * Index a single item to Elasticsearch
 */
export async function indexItem(itemId) {
  try {
    // Fetch item with all relations
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: {
        category: true,
        warehouse: true,
        brand: true,
        supplier: true,
        unit: true
      }
    });

    if (!item) {
      console.log(`Item ${itemId} not found, skipping index`);
      return;
    }

    // Index to Elasticsearch
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
    console.error(`❌ Error indexing item ${itemId}:`, error);
    // Don't throw - log and continue
  }
}

/**
 * Delete item from Elasticsearch
 */
export async function deleteItemFromIndex(itemId) {
  try {
    await esClient.delete({
      index: ITEMS_INDEX,
      id: itemId
    });
    console.log(`✅ Deleted item from index: ${itemId}`);
  } catch (error) {
    if (error.meta?.statusCode === 404) {
      console.log(`Item ${itemId} not in index, skipping delete`);
    } else {
      console.error(`❌ Error deleting item ${itemId}:`, error);
    }
  }
}

/**
 * Update multiple items (e.g., when category/brand/warehouse changes)
 */
export async function reindexItemsByRelation(relationField, relationId) {
  try {
    // Find all items with this relation
    const items = await prisma.item.findMany({
      where: { [relationField]: relationId },
      include: {
        category: true,
        warehouse: true,
        brand: true,
        supplier: true,
        unit: true
      }
    });

    console.log(`🔄 Reindexing ${items.length} items for ${relationField}:${relationId}`);

    // Reindex each item
    for (const item of items) {
      await indexItem(item.id);
    }

    console.log(`✅ Reindexed ${items.length} items`);
  } catch (error) {
    console.error(`❌ Error reindexing items:`, error);
  }
}