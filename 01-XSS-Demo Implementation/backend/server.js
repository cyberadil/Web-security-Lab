const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const xssRoutes = require('./routes/xss-routes');
const securityMiddleware = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
        },
    },
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api/xss', xssRoutes);

// Error handling
app.use(securityMiddleware.errorHandler);

app.listen(PORT, () => {
    console.log(`XSS Demo server running on port ${PORT}`);
});

module.exports = app;