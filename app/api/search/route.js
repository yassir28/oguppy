// app/api/search/route.js
import esClient from '@/lib/elasticsearch/client';
import { ITEMS_INDEX } from '@/lib/elasticsearch/indexMappings';
import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/apiAuthMiddleware';

/**
 * GET /api/search
 * Search inventory items using Elasticsearch
 * Protected: Any authenticated user can search
 * 
 * Query params:
 * - q: search query (required)
 * - category: filter by category ID (optional)
 * - warehouse: filter by warehouse ID (optional)
 * - brand: filter by brand ID (optional)
 * - minPrice: minimum selling price (optional)
 * - maxPrice: maximum selling price (optional)
 * - inStock: true/false - filter items in stock (optional)
 * - lowStock: true/false - filter items at/below reorder point (optional)
 * - size: number of results (default: 20)
 * - from: pagination offset (default: 0)
 */

// Search all items: /api/search?q=
// Returns all 2 items with facets

export async function GET(request) {
  // Check authentication
  const { session, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    
    // Get search parameters
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const warehouse = searchParams.get('warehouse');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');
    const lowStock = searchParams.get('lowStock');
    const size = parseInt(searchParams.get('size') || '20');
    const from = parseInt(searchParams.get('from') || '0');

    // Build the search query
    const must = [];
    const filter = [];

    // Text search across multiple fields
    if (query) {
      must.push({
        multi_match: {
          query: query,
          fields: [
            'title^3',           // Title is most important
            'description^2',     // Description is second
            'sku^2',            // SKU is also important
            'barcode',
            'category.title',
            'brand.title',
            'warehouse.title'
          ],
          fuzziness: 'AUTO',   // Handle typos
          operator: 'or'
        }
      });
    } else {
      // If no query, match all
      must.push({ match_all: {} });
    }

    // these filters are still not used in searchinput only using the http get command.
    
    // Category filter
    if (category) {
      filter.push({
        term: { 'category.id': category }
      });
    }

    // Warehouse filter
    if (warehouse) {
      filter.push({
        term: { 'warehouse.id': warehouse }
      });
    }

    // Brand filter
    if (brand) {
      filter.push({
        term: { 'brand.id': brand }
      });
    }

    // Price range filter
    if (minPrice || maxPrice) {
      const priceRange = {};
      if (minPrice) priceRange.gte = parseFloat(minPrice);
      if (maxPrice) priceRange.lte = parseFloat(maxPrice);
      filter.push({
        range: { sellingPrice: priceRange }
      });
    }

    // In stock filter
    if (inStock === 'true') {
      filter.push({
        range: { quantity: { gt: 0 } }
      });
    }

    // Low stock filter (at or below reorder point)
    if (lowStock === 'true') {
      filter.push({
        script: {
          script: {
            source: "doc['quantity'].value <= doc['reOrderPoint'].value"
          }
        }
      });
    }

    // Execute search
    const result = await esClient.search({
      index: ITEMS_INDEX,
      body: {
        query: {
          bool: {
            must: must,
            filter: filter
          }
        },
        size: size,
        from: from,
        sort: [
          { _score: 'desc' },      // Relevance first
          { 'updatedAt': 'desc' }  // Then most recent
        ],
        // Include aggregations for faceted search
        aggs: {
          categories: {
            terms: { field: 'category.title', size: 10 }
          },
          warehouses: {
            terms: { field: 'warehouse.title', size: 10 }
          },
          brands: {
            terms: { field: 'brand.title', size: 10 }
          },
          price_stats: {
            stats: { field: 'sellingPrice' }
          }
        }
      }
    });

    // Format results
    const hits = result.hits.hits.map(hit => ({
      id: hit._id,
      score: hit._score,
      ...hit._source
    }));

    // Format aggregations for frontend filters
    const facets = {
      categories: result.aggregations.categories.buckets.map(b => ({
        value: b.key,
        count: b.doc_count
      })),
      warehouses: result.aggregations.warehouses.buckets.map(b => ({
        value: b.key,
        count: b.doc_count
      })),
      brands: result.aggregations.brands.buckets.map(b => ({
        value: b.key,
        count: b.doc_count
      })),
      priceRange: {
        min: result.aggregations.price_stats.min,
        max: result.aggregations.price_stats.max,
        avg: result.aggregations.price_stats.avg
      }
    };

    return NextResponse.json({
      success: true,
      query: query,
      total: result.hits.total.value,
      results: hits,
      facets: facets,
      pagination: {
        size: size,
        from: from,
        hasMore: from + size < result.hits.total.value
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({
      success: false,
      message: 'Search failed',
      error: error.message
    }, {
      status: 500
    });
  }
}   