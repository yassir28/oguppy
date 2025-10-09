// scripts/setup-es.js
const { Client } = require('@elastic/elasticsearch');


// Elasticsearch client
const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  compatibilityMode: '8.0'
});


export default esClient;