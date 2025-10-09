// scripts/setup-es.js
const { Client } = require('@elastic/elasticsearch');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Elasticsearch client
const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  compatibilityMode: '8.0'
});

// Index configuration
const ITEMS_INDEX = 'inventory_items';

const itemsMapping = {
  mappings: {
    properties: {
      id: { type: 'keyword' },
      sku: { type: 'keyword' },
      barcode: { type: 'keyword' },
      
      title: { 
        type: 'text',
        fields: {
          keyword: { type: 'keyword' }
        }
      },
      description: { type: 'text' },
      
      quantity: { type: 'integer' },
      sellingPrice: { type: 'float' },
      reOrderPoint: { type: 'integer' },
      
      category: {
        properties: {
          id: { type: 'keyword' },
          title: { type: 'keyword' }
        }
      },
      warehouse: {
        properties: {
          id: { type: 'keyword' },
          title: { type: 'keyword' }
        }
      },
      brand: {
        properties: {
          id: { type: 'keyword' },
          title: { type: 'keyword' }
        }
      },
      
      createdAt: { type: 'date' },
      updatedAt: { type: 'date' }
    }
  }
};

// Test connection
async function testConnection() {
  try {
    const health = await esClient.cluster.health();
    console.log('✅ Elasticsearch connected:', health.status);
    return true;
  } catch (error) {
    console.error('❌ Elasticsearch connection failed:', error.message);
    return false;
  }
}

// Delete index if exists
async function deleteIndexIfExists() {
  try {
    const exists = await esClient.indices.exists({ index: ITEMS_INDEX });
    
    if (exists) {
      await esClient.indices.delete({ index: ITEMS_INDEX });
      console.log(`🗑️  Deleted existing index: ${ITEMS_INDEX}`);
    }
  } catch (error) {
    console.error('❌ Error deleting index:', error.message);
  }
}

// Create index
async function createIndex() {
  try {
    const exists = await esClient.indices.exists({ index: ITEMS_INDEX });
    
    if (exists) {
      console.log(`ℹ️  Index ${ITEMS_INDEX} already exists`);
      return;
    }
    
    await esClient.indices.create({
      index: ITEMS_INDEX,
      body: itemsMapping
    });
    
    console.log(`✅ Index ${ITEMS_INDEX} created successfully`);
  } catch (error) {
    console.error('❌ Error creating index:', error.message);
    throw error;
  }
}

// Bulk index items
async function bulkIndexItems() {
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
    
    console.log(`📦 Found ${items.length} items to index`);
    
    if (items.length === 0) {
      console.log('ℹ️  No items to index');
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
      const errorItems = result.items.filter(item => item.index?.error);
      console.error(`Failed to index ${errorItems.length} items`);
      errorItems.slice(0, 3).forEach((item, i) => {
        console.error(`Error ${i + 1}:`, item.index.error);
      });
    } else {
      console.log(`✅ Successfully indexed ${items.length} items`);
    }
    
  } catch (error) {
    console.error('❌ Error in bulk indexing:', error.message);
    throw error;
  }
}

// Test search
async function testSearch() {
  try {
    console.log('\n🔍 Testing search...');
    
    const result = await esClient.search({
      index: ITEMS_INDEX,
      body: {
        query: {
          match_all: {}
        },
        size: 3
      }
    });
    
    console.log(`✅ Search test successful! Found ${result.hits.total.value} total items`);
    console.log(`   Showing first ${result.hits.hits.length} items:`);
    
    result.hits.hits.forEach((hit, i) => {
      console.log(`   ${i + 1}. ${hit._source.title} (SKU: ${hit._source.sku})`);
    });
    
  } catch (error) {
    console.error('❌ Search test failed:', error.message);
  }
}

// Main setup function
async function main() {
  console.log('🚀 Starting Elasticsearch setup...\n');
  
  try {
    // Step 1: Test connection
    console.log('Step 1: Testing connection...');
    const connected = await testConnection();
    if (!connected) {
      console.error('\n❌ Setup failed: Cannot connect to Elasticsearch');
      console.error('   Make sure Elasticsearch is running on http://localhost:9200');
      process.exit(1);
    }
    console.log('');
    
    // Step 2: Delete old index (optional - ask user)
    const args = process.argv.slice(2);
    if (args.includes('--clean') || args.includes('-c')) {
      console.log('Step 2: Cleaning old index...');
      await deleteIndexIfExists();
      console.log('');
    }
    
    // Step 3: Create index
    console.log('Step 3: Creating index...');
    await createIndex();
    console.log('');
    
    // Step 4: Index items
    console.log('Step 4: Indexing items...');
    await bulkIndexItems();
    console.log('');
    
    // Step 5: Test search
    console.log('Step 5: Running search test...');
    await testSearch();
    
    console.log('\n✅ Elasticsearch setup complete!');
    console.log('\nYou can now use the search API:');
    console.log('   GET /api/search?q=your-search-term\n');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run setup
main();



// to run scipt is easy:
// # node /scripts/setup-es.js