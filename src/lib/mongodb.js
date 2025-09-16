import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
	throw new Error('MONGODB_URI is not set in environment variables');
}

let cached = global._mongoClientCache;
if (!cached) {
	cached = global._mongoClientCache = { client: null, promise: null };
}

export async function getMongoClient() {
	if (cached.client) {
		return cached.client;
	}
	if (!cached.promise) {
		cached.promise = MongoClient.connect(uri, {
			// Future options can go here
		});
	}
	cached.client = await cached.promise;
	return cached.client;
}

export async function getMongoDb(dbName) {
	const client = await getMongoClient();
	return client.db(dbName);
} 