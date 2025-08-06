---
description: Repository Information Overview
alwaysApply: true
---

# Web Security Lab Information

## Summary
A comprehensive educational platform demonstrating various web security vulnerabilities and their prevention techniques. Created by Mohamed Adil, this project includes interactive demos for XSS, SQL Injection, CSRF, E-commerce Security, and a Security Dashboard.

## Structure
The repository is organized into multiple demo implementations, each focusing on a specific security vulnerability:
- `01-XSS-Demo Implementation`: Cross-Site Scripting demonstration
- `02-SQL-Injection-Demo Implementation`: SQL Injection vulnerabilities and prevention
- `03-CSRF-Demo Implementation`: Cross-Site Request Forgery protection
- `04-E-commerce-Security Implementation`: Secure payment processing
- `05-Security-Dashboard Implementation`: Security monitoring and alerts
- `ai-assistant`: ChatGPT-powered Web Security Assistant
- `shared`: Common utilities and configurations

## Language & Runtime
**Language**: JavaScript (Node.js)
**Version**: Node.js (using Express.js framework)
**Build System**: npm
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- express: ^4.18.2 (Web framework)
- bcrypt: ^5.1.0 (Password hashing)
- cors: ^2.8.5 (Cross-Origin Resource Sharing)
- helmet: ^7.0.0 (Security headers)
- mysql2: ^3.6.0 (Database driver)
- jsonwebtoken: ^9.0.0 (JWT authentication)
- dotenv: ^16.3.1 (Environment variables)

**AI Assistant Dependencies**:
- openai: ^4.20.1 (OpenAI API integration)

## Build & Installation
```bash
# Main application
npm install
node server.js

# AI Assistant
cd ai-assistant
npm install
node server.js
```

## Docker
**Configuration**: docker-compose.yml
**Services**:
- app: Main web security lab application (port 3000)
- mysql: MySQL 8.0 database (port 3306)

## Testing
**Framework**: Jest
**Run Command**:
```bash
npm test
```

## Projects

### Main Web Security Lab
**Configuration File**: package.json
**Entry Point**: server.js
**Port**: 3000

#### Features
- XSS (Cross-Site Scripting) Demo
- SQL Injection Demo
- CSRF (Cross-Site Request Forgery) Demo
- E-commerce Security
- Security Dashboard

#### API Endpoints
- `GET /health`: Server health check
- `GET /api/security-info`: Security configuration info
- `POST /api/xss/vulnerable`: Vulnerable XSS endpoint
- `POST /api/xss/secure`: Secure XSS endpoint
- `POST /api/sql/login`: Vulnerable SQL login
- `POST /api/sql-secure/login`: Secure SQL login

### SecBot AI Assistant
**Configuration File**: ai-assistant/package.json
**Entry Point**: ai-assistant/server.js
**Port**: 3001

#### Features
- ChatGPT-powered security assistant
- Web security guidance and education
- CORS and rate limiting protection

#### API Endpoints
- `GET /health`: Service health check
- `POST /api/chat`: Chat with the AI assistant
- `DELETE /api/chat/:sessionId`: Clear chat session
- `GET /api/stats`: Get chat statistics