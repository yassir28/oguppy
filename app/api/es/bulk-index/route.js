import esClient from '@/lib/elasticsearch/client';
import { ITEMS_INDEX } from '@/lib/elasticsearch/indexMappings';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';







export async function POST() {
  try {
    console.log('📥 Fetching items from PostgreSQL...');
    
    const items = await prisma.item.findMany({
      include: {
        category: true,
        warehouse: true,
        brand: true,
        supplier: true,
        unit: true
      }
    });
    
    console.log(`📦 Found ${items.length} items`);
    
    if (items.length === 0) {
      return NextResponse.json({ 
        success: true,
        message: 'No items to index' 
      });
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
      console.error('Some items failed to index');
      return NextResponse.json({ 
        success: false,
        message: 'Bulk indexing had errors',
        errors: result.items.filter(item => item.index?.error)
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true,
      message: `Successfully indexed ${items.length} items`
    });
    
  } catch (error) {
    console.error('Error in bulk indexing:', error);
    return NextResponse.json({ 
      success: false,
      message: error.message 
    }, { status: 500 });
  }
}


