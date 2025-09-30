import prisma from "@/lib/prisma";

/**
 * Fetches all inventory data from database and calculates statistics
 * This provides context for the AI to answer questions accurately
 */
export async function getInventoryContext(userQuery) {
  try {
    // Fetch all items with their related data (category, warehouse, etc.)
    const items = await prisma.item.findMany({
      include: {
        category: true,
        warehouse: true,
        unit: true,
        brand: true,
        supplier: true
      }
    });

    // Calculate inventory statistics
    const totalItems = items.length;
    const totalValue = items.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);
    const lowStockItems = items.filter(item => item.quantity <= item.reOrderPoint);
    const outOfStockItems = items.filter(item => item.quantity === 0);
    
    // Fetch warehouse data
    const warehouses = await prisma.warehouse.findMany();
    
    // Return structured inventory data
    return {
      items,
      stats: {
        totalItems,
        totalValue,
        lowStockCount: lowStockItems.length,
        outOfStockCount: outOfStockItems.length,
        totalWarehouses: warehouses.length
      },
      warehouses
    };
  } catch (error) {
    console.error("Error fetching inventory context:", error);
    return null;
  }
}

/**
 * Extracts relevant data based on the user's query
 * Returns structured data that can be displayed in the chat UI
 * This helps show specific items in a nice format
 */
export function extractRelevantData(query, inventoryData) {
  if (!inventoryData) return null;

  const queryLower = query.toLowerCase();
  
  // Check if user is asking about low stock items
  if (queryLower.includes('low stock') || queryLower.includes('running low')) {
    return {
      items: inventoryData.items
        .filter(item => item.quantity <= item.reOrderPoint && item.quantity > 0)
        .map(item => ({
          title: item.title,
          sku: item.sku,
          quantity: item.quantity,
          reOrderPoint: item.reOrderPoint,
          warehouse: item.warehouse.title
        }))
    };
  }
  
  // Check if user is asking about out of stock items
  if (queryLower.includes('out of stock') || queryLower.includes('zero stock')) {
    return {
      items: inventoryData.items
        .filter(item => item.quantity === 0)
        .map(item => ({
          title: item.title,
          sku: item.sku,
          quantity: item.quantity,
          warehouse: item.warehouse.title
        }))
    };
  }
  
  // Check if user is asking about reorder recommendations
  if (queryLower.includes('reorder') || queryLower.includes('below reorder')) {
    return {
      items: inventoryData.items
        .filter(item => item.quantity <= item.reOrderPoint)
        .map(item => ({
          title: item.title,
          sku: item.sku,
          quantity: item.quantity,
          reOrderPoint: item.reOrderPoint,
          recommendedOrder: Math.max(item.reOrderPoint * 2 - item.quantity, 0),
          warehouse: item.warehouse.title
        }))
    };
  }
  
  // Check if user is asking about top/best items
  if (queryLower.includes('top') || queryLower.includes('best') || queryLower.includes('highest')) {
    return {
      items: inventoryData.items
        .sort((a, b) => (b.sellingPrice * b.quantity) - (a.sellingPrice * a.quantity))
        .slice(0, 10)
        .map(item => ({
          title: item.title,
          sku: item.sku,
          quantity: item.quantity,
          value: item.sellingPrice * item.quantity,
          warehouse: item.warehouse.title
        }))
    };
  }
  
  // Check if user is asking about total value
  if (queryLower.includes('total value') || queryLower.includes('inventory value')) {
    return {
      totalValue: inventoryData.stats.totalValue,
      totalItems: inventoryData.stats.totalItems
    };
  }

  // No specific data to extract - AI will answer in text only
  return null;
}