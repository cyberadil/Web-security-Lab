const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const { dbConfig } = require('../shared/config/database');

// VULNERABLE LOGIN (Educational Purpose)
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const connection = await mysql.createConnection(dbConfig);
        
        // DANGEROUS: String concatenation - vulnerable to SQL injection
        const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
        
        console.log('Executing vulnerable query:', query);
        
        const [results] = await connection.execute(query);
        
        if (results.length > 0) {
            res.json({
                success: true,
                message: 'Login successful',
                user: results[0],
                vulnerability: 'This query is vulnerable to SQL injection',
                query: query
            });
        } else {
            res.json({
                success: false,
                message: 'Invalid credentials',
                vulnerability: 'Query executed but credentials invalid',
                query: query
            });
        }
        
        await connection.end();
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            message: 'Database error',
            error: error.message,
            vulnerability: 'Error might reveal database structure'
        });
    }
});

module.exports = router;