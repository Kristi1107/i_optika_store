// src/lib/db.ts
import { MongoClient } from 'mongodb';
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'i_optika';

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

export async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(MONGODB_URI);
    await cachedClient.connect();
  }

  cachedDb = cachedClient.db(MONGODB_DB);
  return cachedDb;
}