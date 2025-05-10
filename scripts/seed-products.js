// scripts/seed-products.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/i_optika';
const MONGODB_DB = process.env.MONGODB_DB || 'i_optika';

// Sample product data
const productData = [
  {
    id: 'frame-1',
    name: 'Ray-Ban Classic Wayfarers',
    brand: 'Ray-Ban',
    price: 199,
    salePrice: null,
    category: 'sunglasses',
    frameType: 'full-rim',
    gender: 'unisex',
    inStock: true,
    stockQuantity: 24,
    rating: 4.8,
    reviewCount: 124,
    description: 'The iconic Ray-Ban Wayfarer is simply the most recognizable style in sunglasses.',
    features: [
      'UV Protection: 100% UV400 protection against harmful UVA/UVB rays',
      'Frame Material: High-quality acetate for durability and comfort',
      'Lens Technology: Crystal lenses with superior clarity and scratch resistance',
      'Style: Classic, timeless design suitable for all face shapes'
    ],
    colors: [
      { name: 'Black', code: '#111827' },
      { name: 'Tortoise', code: '#b45309' },
      { name: 'Blue', code: '#2563eb' }
    ],
    sizes: [
      { size: '50-22', description: 'Small', dimensions: 'Lens: 50mm, Bridge: 22mm, Temple: 150mm' },
      { size: '52-22', description: 'Medium', dimensions: 'Lens: 52mm, Bridge: 22mm, Temple: 150mm' },
      { size: '54-22', description: 'Large', dimensions: 'Lens: 54mm, Bridge: 22mm, Temple: 150mm' }
    ],
    images: [
      '/placeholder-product-1.jpg',
      '/placeholder-product-1-alt.jpg',
      '/placeholder-product-1-side.jpg',
      '/placeholder-product-1-worn.jpg'
    ],
    createdAt: new Date()
  },
  // Add more products here...
];

async function seedProducts() {
  let client;

  try {
    client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(MONGODB_DB);
    
    // Check if products already exist
    const existingProducts = await db.collection('products').countDocuments();
    
    if (existingProducts > 0) {
      console.log('Products already exist in the database');
      return;
    }
    
    // Insert products
    const result = await db.collection('products').insertMany(productData);
    
    console.log(`${result.insertedCount} products inserted successfully`);
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

seedProducts();