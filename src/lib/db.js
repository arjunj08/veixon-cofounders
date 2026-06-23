import { MongoClient } from 'mongodb'

let client
let dbPromise

export async function getDb() {
  if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL not configured. Add it to .env.local (e.g. mongodb://127.0.0.1:27017)')
  }
  if (!dbPromise) {
    client = new MongoClient(process.env.MONGO_URL)
    dbPromise = client.connect().then(c => c.db(process.env.DB_NAME || 'visionix_founders'))
  }
  return dbPromise
}
