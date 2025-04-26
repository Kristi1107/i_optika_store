// scripts/seed-admin.js
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/i_optika';
const MONGODB_DB = process.env.MONGODB_DB || 'i_optika';

async function seedAdmin() {
  let client;

  try {
    client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(MONGODB_DB);
    
    // Check if admin already exists
    const adminUser = await db.collection('users').findOne({ username: 'admin' });
    
    if (adminUser) {
      console.log('Admin user already exists');
      return;
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    // Create admin user
    await db.collection('users').insertOne({
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
      email: 'admin@ioptika.com',
      createdAt: new Date(),
    });
    
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

seedAdmin();