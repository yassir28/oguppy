import { createItemsIndex } from '../lib/elasticsearch/indexManager.js';
import { bulkIndexItems } from '../lib/elasticsearch/syncItems.js';
import { testConnection } from '../lib/elasticsearch/client.js';

async function setup() {
  console.log('🚀 Starting Elasticsearch setup...\n');
  
  // Test connection
  const connected = await testConnection();
  if (!connected) {
    console.error('❌ Cannot connect to Elasticsearch. Make sure it\'s running!');
    process.exit(1);
  }
  
  // Create index
  await createItemsIndex();
  
  // Bulk index items
  await bulkIndexItems();
  
  console.log('\n✅ Elasticsearch setup complete!');
  process.exit(0);
}

setup();