const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const { dbConfig } = require('../../../shared/config/database');

// SECURE LOGIN
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Input validation
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required',
            security: 'Input validation prevents empty submissions'
        });
    }
    
    try {
        const connection = await mysql.createConnection(dbConfig);
        
        // SECURE: Parameterized query
        const query = 'SELECT * FROM users WHERE username = ? LIMIT 1';
        
        const [results] = await connection.execute(query, [username]);
        
        if (results.length > 0) {
            const user = results[0];
            const isValidPassword = await bcrypt.compare(password, user.password);
            
            if (isValidPassword) {
                res.json({
                    success: true,
                    message: 'Login successful',
                    user: { id: user.id, username: user.username },
                    security: 'Parameterized query prevents SQL injection'
                });
            } else {
                res.json({
                    success: false,
                    message: 'Invalid credentials',
                    security: 'Password hashed and compared securely'
                });
            }
        } else {
            res.json({
                success: false,
                message: 'Invalid credentials',
                security: 'Generic error message prevents user enumeration'
            });
        }
        
        await connection.end();
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            security: 'Generic error message hides system details'
        });
    }
});

module.exports = router;