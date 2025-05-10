const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/i_optika';
const MONGODB_DB = process.env.MONGODB_DB || 'i_optika';

async function clearProducts() {
  let client;

  try {
    client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(MONGODB_DB);
    
    // Delete all products
    const result = await db.collection('products').deleteMany({});
    
    console.log(`Deleted ${result.deletedCount} products.`);
  } catch (error) {
    console.error('Error clearing products:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

clearProducts();