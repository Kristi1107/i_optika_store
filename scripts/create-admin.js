// scripts/create-admin.js
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/i_optika';
const MONGODB_DB = process.env.MONGODB_DB || 'i_optika';

async function createAdmin() {
  let client;

  try {
    client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(MONGODB_DB);
    
    // Create a new admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const result = await db.collection('users').insertOne({
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
      email: 'kristinikolla1@yahoo.com',
      createdAt: new Date()
    });
    
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

createAdmin();