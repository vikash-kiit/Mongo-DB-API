/**
 * MongoDB Seed Script
 * Run this script to populate your database with sample data for Postman testing
 * Usage: node seed.js
 */

require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
// Use the default database from the MongoDB URI (same as server)

// Sample Users Data
const users = [
    {
        name: "Vikas Kumar",
        email: "vikas@example.com",
        age: 25,
        city: "Delhi",
        phone: "+91-9876543210",
        isActive: true,
        createdAt: new Date()
    },
    {
        name: "Rahul Sharma",
        email: "rahul@example.com",
        age: 30,
        city: "Mumbai",
        phone: "+91-9876543211",
        isActive: true,
        createdAt: new Date()
    },
    {
        name: "Priya Singh",
        email: "priya@example.com",
        age: 28,
        city: "Bangalore",
        phone: "+91-9876543212",
        isActive: false,
        createdAt: new Date()
    },
    {
        name: "Amit Patel",
        email: "amit@example.com",
        age: 35,
        city: "Ahmedabad",
        phone: "+91-9876543213",
        isActive: true,
        createdAt: new Date()
    },
    {
        name: "Sneha Gupta",
        email: "sneha@example.com",
        age: 22,
        city: "Kolkata",
        phone: "+91-9876543214",
        isActive: true,
        createdAt: new Date()
    }
];

// Sample Products Data
const products = [
    {
        name: "Laptop",
        price: 50000,
        category: "Electronics",
        brand: "Dell",
        stock: 25,
        description: "High performance laptop with 16GB RAM",
        createdAt: new Date()
    },
    {
        name: "Smartphone",
        price: 25000,
        category: "Electronics",
        brand: "Samsung",
        stock: 100,
        description: "5G enabled smartphone with 128GB storage",
        createdAt: new Date()
    },
    {
        name: "Wireless Headphones",
        price: 2000,
        category: "Accessories",
        brand: "Sony",
        stock: 50,
        description: "Noise-cancelling wireless headphones",
        createdAt: new Date()
    },
    {
        name: "Mechanical Keyboard",
        price: 5000,
        category: "Accessories",
        brand: "Logitech",
        stock: 30,
        description: "RGB mechanical keyboard with blue switches",
        createdAt: new Date()
    },
    {
        name: "Monitor",
        price: 15000,
        category: "Electronics",
        brand: "LG",
        stock: 15,
        description: "27-inch 4K IPS monitor",
        createdAt: new Date()
    },
    {
        name: "Mouse",
        price: 1500,
        category: "Accessories",
        brand: "Logitech",
        stock: 75,
        description: "Ergonomic wireless mouse",
        createdAt: new Date()
    }
];

// Sample Orders Data
const orders = [
    {
        orderNumber: "ORD-2026-001",
        customerName: "Vikas Kumar",
        customerEmail: "vikas@example.com",
        items: [
            { productName: "Laptop", quantity: 1, price: 50000 },
            { productName: "Mouse", quantity: 1, price: 1500 }
        ],
        totalAmount: 51500,
        status: "delivered",
        shippingAddress: "123 Main Street, Delhi",
        orderDate: new Date("2026-01-10"),
        deliveryDate: new Date("2026-01-12")
    },
    {
        orderNumber: "ORD-2026-002",
        customerName: "Rahul Sharma",
        customerEmail: "rahul@example.com",
        items: [
            { productName: "Smartphone", quantity: 1, price: 25000 },
            { productName: "Wireless Headphones", quantity: 1, price: 2000 }
        ],
        totalAmount: 27000,
        status: "shipped",
        shippingAddress: "456 Park Avenue, Mumbai",
        orderDate: new Date("2026-01-11"),
        deliveryDate: null
    },
    {
        orderNumber: "ORD-2026-003",
        customerName: "Priya Singh",
        customerEmail: "priya@example.com",
        items: [
            { productName: "Monitor", quantity: 2, price: 30000 }
        ],
        totalAmount: 30000,
        status: "processing",
        shippingAddress: "789 Tech Park, Bangalore",
        orderDate: new Date("2026-01-12"),
        deliveryDate: null
    }
];

// Sample Test Data
const testData = [
    {
        message: "Hello MongoDB!",
        timestamp: new Date(),
        status: "success",
        type: "greeting"
    },
    {
        message: "API Connection Test",
        timestamp: new Date(),
        status: "success",
        type: "connection"
    },
    {
        message: "Database Health Check",
        timestamp: new Date(),
        status: "active",
        type: "health"
    }
];

// Sample Employees Data
const employees = [
    {
        employeeId: "EMP001",
        firstName: "Raj",
        lastName: "Kumar",
        email: "raj.kumar@company.com",
        department: "Engineering",
        position: "Senior Developer",
        salary: 120000,
        joinDate: new Date("2023-01-15"),
        skills: ["JavaScript", "Node.js", "MongoDB", "React"],
        isActive: true
    },
    {
        employeeId: "EMP002",
        firstName: "Anjali",
        lastName: "Verma",
        email: "anjali.verma@company.com",
        department: "HR",
        position: "HR Manager",
        salary: 80000,
        joinDate: new Date("2022-06-01"),
        skills: ["Recruitment", "Employee Relations", "Training"],
        isActive: true
    },
    {
        employeeId: "EMP003",
        firstName: "Sanjay",
        lastName: "Mehta",
        email: "sanjay.mehta@company.com",
        department: "Sales",
        position: "Sales Lead",
        salary: 90000,
        joinDate: new Date("2024-03-10"),
        skills: ["Sales", "Negotiation", "CRM"],
        isActive: true
    },
    {
        employeeId: "EMP004",
        firstName: "Meera",
        lastName: "Nair",
        email: "meera.nair@company.com",
        department: "Engineering",
        position: "Junior Developer",
        salary: 60000,
        joinDate: new Date("2025-01-01"),
        skills: ["Python", "Django", "SQL"],
        isActive: true
    }
];

async function seedDatabase() {
    const client = new MongoClient(MONGODB_URI);

    try {
        console.log('🔌 Connecting to MongoDB...');
        await client.connect();
        console.log('✅ Connected to MongoDB');

        const db = client.db(); // Uses default database from MongoDB URI

        // Clear existing data (optional - comment out if you want to keep existing data)
        console.log('\n🗑️  Clearing existing collections...');
        const collections = ['users', 'products', 'orders', 'test', 'employees'];
        for (const collName of collections) {
            try {
                await db.collection(collName).drop();
                console.log(`   Dropped: ${collName}`);
            } catch (e) {
                // Collection might not exist, that's fine
            }
        }

        // Insert Users
        console.log('\n📝 Inserting sample data...');
        const usersResult = await db.collection('users').insertMany(users);
        console.log(`   ✅ Users: ${usersResult.insertedCount} documents inserted`);

        // Insert Products
        const productsResult = await db.collection('products').insertMany(products);
        console.log(`   ✅ Products: ${productsResult.insertedCount} documents inserted`);

        // Insert Orders
        const ordersResult = await db.collection('orders').insertMany(orders);
        console.log(`   ✅ Orders: ${ordersResult.insertedCount} documents inserted`);

        // Insert Test Data
        const testResult = await db.collection('test').insertMany(testData);
        console.log(`   ✅ Test: ${testResult.insertedCount} documents inserted`);

        // Insert Employees
        const employeesResult = await db.collection('employees').insertMany(employees);
        console.log(`   ✅ Employees: ${employeesResult.insertedCount} documents inserted`);

        // Print sample IDs for Postman testing
        console.log('\n📋 Sample Document IDs for Postman testing:');
        console.log('   ----------------------------------------');

        const sampleUser = await db.collection('users').findOne();
        const sampleProduct = await db.collection('products').findOne();
        const sampleOrder = await db.collection('orders').findOne();
        const sampleEmployee = await db.collection('employees').findOne();

        console.log(`   User ID: ${sampleUser._id}`);
        console.log(`   Product ID: ${sampleProduct._id}`);
        console.log(`   Order ID: ${sampleOrder._id}`);
        console.log(`   Employee ID: ${sampleEmployee._id}`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📌 Available Collections:');
        console.log('   - users (5 documents)');
        console.log('   - products (6 documents)');
        console.log('   - orders (3 documents)');
        console.log('   - test (3 documents)');
        console.log('   - employees (4 documents)');

        console.log('\n🧪 You can now test the following endpoints in Postman:');
        console.log('   GET  /api/collections         - List all collections');
        console.log('   GET  /api/data/users          - Get all users');
        console.log('   GET  /api/data/products       - Get all products');
        console.log('   GET  /api/data/orders         - Get all orders');
        console.log('   GET  /api/data/employees      - Get all employees');
        console.log(`   GET  /api/data/users/${sampleUser._id} - Get user by ID`);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await client.close();
        console.log('\n🔌 MongoDB connection closed');
    }
}

// Run the seed function
seedDatabase();
