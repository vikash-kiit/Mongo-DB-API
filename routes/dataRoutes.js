const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

// @route   GET /api/data/:collection
// @desc    Get all documents from a collection
// @access  Public
router.get('/:collection', async (req, res) => {
    try {
        const { collection } = req.params;
        const { limit = 100, skip = 0, sort = '_id', order = 'desc' } = req.query;

        const db = getDB();
        const col = db.collection(collection);

        const data = await col.find()
            .sort({ [sort]: order === 'desc' ? -1 : 1 })
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .toArray();

        const total = await col.countDocuments();

        res.json({
            success: true,
            count: data.length,
            total,
            data
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// @route   GET /api/data/:collection/:id
// @desc    Get single document by ID
// @access  Public
router.get('/:collection/:id', async (req, res) => {
    try {
        const { collection, id } = req.params;
        const db = getDB();
        const col = db.collection(collection);

        // Check if ID is valid ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid document ID format'
            });
        }

        const data = await col.findOne({ _id: new ObjectId(id) });

        if (!data) {
            return res.status(404).json({
                success: false,
                error: 'Document not found'
            });
        }

        res.json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// @route   POST /api/data/:collection
// @desc    Create a new document (for testing/receiving SAP CPI data)
// @access  Public
router.post('/:collection', async (req, res) => {
    try {
        const { collection } = req.params;
        const db = getDB();
        const col = db.collection(collection);

        const result = await col.insertOne(req.body);

        res.status(201).json({
            success: true,
            message: 'Document created successfully',
            insertedId: result.insertedId,
            data: { _id: result.insertedId, ...req.body }
        });
    } catch (error) {
        console.error('Error creating document:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// @route   POST /api/data/:collection/bulk
// @desc    Create multiple documents (bulk insert from SAP CPI)
// @access  Public
router.post('/:collection/bulk', async (req, res) => {
    try {
        const { collection } = req.params;
        const db = getDB();
        const col = db.collection(collection);

        if (!Array.isArray(req.body)) {
            return res.status(400).json({
                success: false,
                error: 'Request body must be an array of documents'
            });
        }

        const result = await col.insertMany(req.body);

        res.status(201).json({
            success: true,
            message: `${result.insertedCount} documents created successfully`,
            insertedCount: result.insertedCount,
            insertedIds: result.insertedIds
        });
    } catch (error) {
        console.error('Error bulk inserting:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// @route   PUT /api/data/:collection/:id
// @desc    Update a document
// @access  Public
router.put('/:collection/:id', async (req, res) => {
    try {
        const { collection, id } = req.params;
        const db = getDB();
        const col = db.collection(collection);

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid document ID format'
            });
        }

        const result = await col.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: req.body },
            { returnDocument: 'after' }
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                error: 'Document not found'
            });
        }

        res.json({
            success: true,
            message: 'Document updated successfully',
            data: result
        });
    } catch (error) {
        console.error('Error updating document:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// @route   DELETE /api/data/:collection/:id
// @desc    Delete a document
// @access  Public
router.delete('/:collection/:id', async (req, res) => {
    try {
        const { collection, id } = req.params;
        const db = getDB();
        const col = db.collection(collection);

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid document ID format'
            });
        }

        const result = await col.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                error: 'Document not found'
            });
        }

        res.json({
            success: true,
            message: 'Document deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// @route   POST /api/data/:collection/query
// @desc    Query documents with filters (for SAP CPI lookups)
// @access  Public
router.post('/:collection/query', async (req, res) => {
    try {
        const { collection } = req.params;
        const { filter = {}, projection = {}, options = {} } = req.body;
        const db = getDB();
        const col = db.collection(collection);

        let cursor = col.find(filter, { projection });

        if (options.sort) cursor = cursor.sort(options.sort);
        if (options.skip) cursor = cursor.skip(options.skip);
        if (options.limit) cursor = cursor.limit(options.limit);

        const data = await cursor.toArray();
        const total = await col.countDocuments(filter);

        res.json({
            success: true,
            count: data.length,
            total,
            data
        });
    } catch (error) {
        console.error('Error querying data:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
