require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, getDB, closeDB } = require('./config/db');
const dataRoutes = require('./routes/dataRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for bulk data
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'MongoDB API is running',
        version: '1.0.0',
        driver: 'Native MongoDB Driver',
        endpoints: {
            health: 'GET /',
            collections: 'GET /api/collections',
            getData: 'GET /api/data/:collection',
            getDocument: 'GET /api/data/:collection/:id',
            createDocument: 'POST /api/data/:collection',
            bulkInsert: 'POST /api/data/:collection/bulk',
            queryData: 'POST /api/data/:collection/query',
            updateDocument: 'PUT /api/data/:collection/:id',
            deleteDocument: 'DELETE /api/data/:collection/:id'
        }
    });
});

// List all collections endpoint
app.get('/api/collections', async (req, res) => {
    try {
        const db = getDB();
        const collections = await db.listCollections().toArray();
        res.json({
            success: true,
            count: collections.length,
            collections: collections.map(c => c.name)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Routes
app.use('/api/data', dataRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message
    });
});

const PORT = process.env.PORT || 5000;

// Start server after connecting to MongoDB
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`
🚀 Server running on port ${PORT}
📡 API Base URL: http://localhost:${PORT}
📋 API Docs: http://localhost:${PORT}/
      `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
    await closeDB();
    process.exit(0);
});

startServer();
