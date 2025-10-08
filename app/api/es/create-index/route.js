import esClient from '@/lib/elasticsearch/client';
import { ITEMS_INDEX, itemsMapping } from '@/lib/elasticsearch/indexMappings';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Check if index exists
    const exists = await esClient.indices.exists({ index: ITEMS_INDEX });
    
    if (exists) {
      return NextResponse.json({ 
        success: false,
        message: `Index ${ITEMS_INDEX} already exists` 
      }, { status: 400 });
    }
    
    // Create index
    await esClient.indices.create({
      index: ITEMS_INDEX,
      body: itemsMapping
    });
    
    return NextResponse.json({ 
      success: true,
      message: `Index ${ITEMS_INDEX} created successfully` 
    });
    
  } catch (error) {
    // Better error logging
    console.error('❌ Error creating index:', error);
    console.error('Error details:', {
      message: error.message,
      meta: error.meta,
      body: error.meta?.body
    });
    
    return NextResponse.json({ 
      success: false,
      message: error.message || 'Unknown error',
      details: error.meta?.body || error.toString()
    }, { status: 500 });
  }
}