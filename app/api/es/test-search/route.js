import esClient from '@/lib/elasticsearch/client';
import { ITEMS_INDEX } from '@/lib/elasticsearch/indexMappings';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    
    const result = await esClient.search({
      index: ITEMS_INDEX,
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ['title^3', 'description', 'sku^2'],
            fuzziness: 'AUTO'
          }
        }
      }
    });
    
    const hits = result.hits.hits.map(hit => ({
      id: hit._id,
      score: hit._score,
      ...hit._source
    }));
    
    return NextResponse.json({ 
      success: true,
      total: result.hits.total.value,
      results: hits
    });
    
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ 
      success: false,
      message: error.message 
    }, { status: 500 });
  }
}


// Search in http://localhost:9200/inventory_items/_doc/602725f3-94ab-4833-804e-6d0d233b6407
// Endpoint                               What It Shows
// GET /inventory_items                   Index metadata (mappings, settings)
// GET /inventory_items/_search           Actual documents/data
// GET /inventory_items/_count            Number of documents
// GET /inventory_items/_doc/123          Specific document with ID 123
// GET /inventory_items/_mapping          Just the mappings
// GET /inventory_items/_settings         Just the settings