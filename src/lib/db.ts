// src/lib/db.ts
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/i_optika';
const MONGODB_DB = process.env.MONGODB_DB || 'i_optika';

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

export async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  if (!cachedClient) {
    cachedClient = await MongoClient.connect(MONGODB_URI);
  }

  cachedDb = cachedClient.db(MONGODB_DB);
  return cachedDb;
}