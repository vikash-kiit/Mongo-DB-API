# MongoDB Cloud API

A Node.js REST API to fetch and manage data from MongoDB Cloud (Atlas). Perfect for testing and integrating with SAP CPI.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure MongoDB Connection
Edit the `.env` file and replace the placeholder with your MongoDB Atlas connection string:
```
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database?retryWrites=true&w=majority
```

### 3. Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### Health Check
- `GET /` - API info and available endpoints
- `GET /api/collections` - List all collections in the database

### CRUD Operations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/data/:collection` | Get all documents from a collection |
| GET | `/api/data/:collection/:id` | Get a single document by ID |
| POST | `/api/data/:collection` | Create a new document |
| POST | `/api/data/:collection/bulk` | Bulk insert documents |
| POST | `/api/data/:collection/query` | Query with filters |
| PUT | `/api/data/:collection/:id` | Update a document |
| DELETE | `/api/data/:collection/:id` | Delete a document |

### Query Parameters (for GET requests)
- `limit` - Number of documents (default: 100)
- `skip` - Number of documents to skip (pagination)
- `sort` - Field to sort by (default: _id)
- `order` - Sort order: `asc` or `desc`

## 📬 Postman Examples

### Get All Documents from a Collection
```
GET http://localhost:5000/api/data/your_collection_name
```

### Get with Pagination
```
GET http://localhost:5000/api/data/your_collection_name?limit=10&skip=0&sort=createdAt&order=desc
```

### Create a Document
```
POST http://localhost:5000/api/data/your_collection_name
Content-Type: application/json

{
  "name": "Test Document",
  "value": 123,
  "data": {
    "field1": "value1"
  }
}
```

### Bulk Insert (for SAP CPI data)
```
POST http://localhost:5000/api/data/sap_data/bulk
Content-Type: application/json

[
  { "materialId": "MAT001", "description": "Material 1" },
  { "materialId": "MAT002", "description": "Material 2" }
]
```

### Query with Filters
```
POST http://localhost:5000/api/data/your_collection_name/query
Content-Type: application/json

{
  "filter": { "status": "active" },
  "projection": { "name": 1, "status": 1 },
  "options": { "limit": 10, "sort": { "createdAt": -1 } }
}
```

## 🔧 Project Structure
```
├── config/
│   └── db.js           # MongoDB connection
├── models/
│   └── Data.js         # Dynamic data model
├── routes/
│   └── dataRoutes.js   # API routes
├── .env                # Environment variables
├── package.json
├── server.js           # Entry point
└── README.md
```

## 🔗 MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a cluster (free tier available)
3. Go to "Database Access" and create a user
4. Go to "Network Access" and add your IP (or 0.0.0.0/0 for all IPs)
5. Click "Connect" on your cluster and copy the connection string
6. Paste the connection string in your `.env` file
