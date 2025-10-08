import esClient from '@/lib/elasticsearch/client';
import { ITEMS_INDEX } from '@/lib/elasticsearch/indexMappings';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { itemId } = await request.json();
    
    if (!itemId) {
      return NextResponse.json({ 
        success: false,
        message: 'itemId is required' 
      }, { status: 400 });
    }
    
    // Fetch item from PostgreSQL
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
      return NextResponse.json({ 
        success: false,
        message: 'Item not found' 
      }, { status: 404 });
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
    });
    
    // Refresh index to make searchable immediately
    await esClient.indices.refresh({ index: ITEMS_INDEX });
    
    return NextResponse.json({ 
      success: true,
      message: `Item "${item.title}" indexed successfully`,
      item: {
        id: item.id,
        title: item.title,
        sku: item.sku
      }
    });
    
  } catch (error) {
    console.error('Error indexing item:', error);
    return NextResponse.json({ 
      success: false,
      message: error.message 
    }, { status: 500 });
  }
}