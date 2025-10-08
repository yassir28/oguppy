import { Client } from '@elastic/elasticsearch';

const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  // Compatibility mode
  compatibilityMode: '8.0'
});

export async function testConnection() {
  try {
    const health = await esClient.cluster.health();
    console.log('✅ Elasticsearch connected:', health.status);
    return true;
  } catch (error) {
    console.error('❌ Elasticsearch connection failed:', error.message);
    return false;
  }
}

export default esClient;