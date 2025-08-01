// Database Configuration
// Created by Mohamed Adil

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'web_security_lab',
    port: process.env.DB_PORT || 3306,
    charset: 'utf8mb4',
    timezone: '+00:00',
    
    // Connection pool settings
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    
    // Security settings
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false
};

// Test database connection
const testConnection = async () => {
    try {
        const mysql = require('mysql2/promise');
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ Database connection successful');
        await connection.end();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};

// Create tables if they don't exist
const initializeDatabase = async () => {
    try {
        const mysql = require('mysql2/promise');
        const connection = await mysql.createConnection(dbConfig);
        
        // Create users table
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(100) UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_username (username),
                INDEX idx_email (email)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `;
        
        // Create security_logs table
        const createSecurityLogsTable = `
            CREATE TABLE IF NOT EXISTS security_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                event_type VARCHAR(50) NOT NULL,
                user_id INT,
                ip_address VARCHAR(45),
                user_agent TEXT,
                details JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_event_type (event_type),
                INDEX idx_created_at (created_at),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `;
        
        // Create sessions table
        const createSessionsTable = `
            CREATE TABLE IF NOT EXISTS sessions (
                id VARCHAR(128) PRIMARY KEY,
                user_id INT,
                data JSON,
                expires TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_user_id (user_id),
                INDEX idx_expires (expires),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `;
        
        await connection.execute(createUsersTable);
        await connection.execute(createSecurityLogsTable);
        await connection.execute(createSessionsTable);
        
        console.log('✅ Database tables initialized successfully');
        await connection.end();
        
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        throw error;
    }
};

// Insert demo data
const insertDemoData = async () => {
    try {
        const mysql = require('mysql2/promise');
        const bcrypt = require('bcrypt');
        const connection = await mysql.createConnection(dbConfig);
        
        // Check if demo users exist
        const [existingUsers] = await connection.execute('SELECT COUNT(*) as count FROM users');
        
        if (existingUsers[0].count === 0) {
            // Create demo users
            const demoUsers = [
                {
                    username: 'admin',
                    password: await bcrypt.hash('admin123', 10),
                    email: 'admin@securitylab.com'
                },
                {
                    username: 'user1',
                    password: await bcrypt.hash('password123', 10),
                    email: 'user1@securitylab.com'
                },
                {
                    username: 'test',
                    password: await bcrypt.hash('test123', 10),
                    email: 'test@securitylab.com'
                }
            ];
            
            for (const user of demoUsers) {
                await connection.execute(
                    'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
                    [user.username, user.password, user.email]
                );
            }
            
            console.log('✅ Demo users created successfully');
        }
        
        await connection.end();
        
    } catch (error) {
        console.error('❌ Demo data insertion failed:', error.message);
    }
};

module.exports = {
    dbConfig,
    testConnection,
    initializeDatabase,
    insertDemoData
}; 