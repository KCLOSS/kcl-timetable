import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error(
    'Define MONGODB_URI environment variable'
  )
}

let cached = (global as any).mongo

if (!cached) {
  cached = (global as any).mongo = { conn: null, promise: null }
}

export async function connectToDatabase(): Promise<MongoClient> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = MongoClient
    .connect(MONGODB_URI)
  }
  
  cached.conn = await cached.promise
  return cached.conn
}
