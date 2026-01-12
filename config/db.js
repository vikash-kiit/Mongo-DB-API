const { MongoClient, ServerApiVersion } = require('mongodb');

let client;
let db;

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;

        // Create a MongoClient with a MongoClientOptions object
        client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        // Connect the client to the server
        await client.connect();

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("✅ Connected to MongoDB Atlas!");

        // Get the database (you can specify database name or use default from URI)
        db = client.db();

        return { client, db };
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

// Get database instance
const getDB = () => {
    if (!db) {
        throw new Error('Database not initialized. Call connectDB first.');
    }
    return db;
};

// Get client instance
const getClient = () => {
    if (!client) {
        throw new Error('Client not initialized. Call connectDB first.');
    }
    return client;
};

// Close connection
const closeDB = async () => {
    if (client) {
        await client.close();
        console.log('MongoDB connection closed');
    }
};

module.exports = { connectDB, getDB, getClient, closeDB };
