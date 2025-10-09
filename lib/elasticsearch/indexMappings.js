// Index configuration
export const ITEMS_INDEX = 'inventory_items';

export const itemsMapping = {
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
