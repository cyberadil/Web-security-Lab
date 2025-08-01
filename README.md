# 🔒 Web Security Lab

A comprehensive educational platform demonstrating various web security vulnerabilities and their prevention techniques. Created by **Mohamed Adil**.

## 🚀 Quick Start

### Option 1: Using PowerShell (Recommended for Windows)
```powershell
.\start-server.ps1
```

### Option 2: Manual Setup
```bash
# Install dependencies
npm install

# Start the server
node server.js
```

### Option 3: Direct Browser Access
Simply open `01-XSS-Demo Implementation/frontend/index.html` in your browser for the XSS demo.

## 🎯 Available Demos

### 1. **XSS (Cross-Site Scripting) Demo** ✅
- **Location**: `01-XSS-Demo Implementation/`
- **Features**: 
  - Interactive vulnerable vs secure implementations
  - Real-time XSS detection
  - Modern cybersecurity UI theme
  - Educational payload examples
- **Access**: `http://localhost:3000/` or open `frontend/index.html`

### 2. **SQL Injection Demo** ✅
- **Location**: `02-SQL-Injection-Demo Implementation/`
- **Features**:
  - Vulnerable authentication endpoint
  - Secure parameterized queries
  - Database connection management
- **API Endpoints**:
  - Vulnerable: `POST /api/sql/login`
  - Secure: `POST /api/sql-secure/login`

### 3. **CSRF (Cross-Site Request Forgery) Demo** ✅
- **Location**: `03-CSRF-Demo Implementation/`
- **Features**:
  - Token-based protection
  - Session management
  - Request validation
- **Middleware**: Available as Express middleware

### 4. **E-commerce Security** ✅
- **Location**: `04-E-commerce-Security Implementation/`
- **Features**:
  - Secure payment processing
  - Input validation
  - Data encryption

### 5. **Security Dashboard** ✅
- **Location**: `05-Security-Dashboard Implementation/`
- **Features**:
  - Vulnerability scanning
  - Security monitoring
  - Real-time alerts

## 🛡️ Security Features

### Implemented Protections
- ✅ **XSS Prevention**: HTML entity encoding, pattern filtering
- ✅ **SQL Injection Prevention**: Parameterized queries, input validation
- ✅ **CSRF Protection**: Token-based validation, session management
- ✅ **Rate Limiting**: Request throttling, brute force protection
- ✅ **Security Headers**: Helmet.js, CSP, HSTS
- ✅ **Input Validation**: Comprehensive sanitization
- ✅ **Error Handling**: Secure error messages
- ✅ **Logging**: Security event tracking

### Educational Value
- **Vulnerable Implementations**: Show real attack vectors
- **Secure Implementations**: Demonstrate proper defenses
- **Interactive Learning**: Hands-on testing experience
- **Visual Feedback**: Color-coded security indicators
- **Documentation**: Comprehensive explanations

## 🏗️ Project Structure

```
Web Security Lab/
├── 01-XSS-Demo Implementation/
│   ├── frontend/
│   │   ├── index.html          # Main demo page
│   │   ├── css/style.css       # Cybersecurity theme
│   │   └── js/
│   │       ├── security-utils.js
│   │       └── xss-demo.js
│   ├── backend/
│   │   └── routes/xss-routes.js
│   └── README.md
├── 02-SQL-Injection-Demo Implementation/
│   ├── auth-vulnerable.js      # Vulnerable auth
│   └── backend/routes/auth-secure.js
├── 03-CSRF-Demo Implementation/
│   └── middleware/csrf-protection.js
├── 04-E-commerce-Security Implementation/
│   └── backend/services/payment-processor.js
├── 05-Security-Dashboard Implementation/
│   └── backend/services/vulnerability-scanner.js
├── shared/
│   └── config/database.js      # Database configuration
├── server.js                   # Main server
├── start-server.ps1           # PowerShell startup script
├── package.json
└── README.md
```

## 🔧 Technical Stack

### Frontend
- **HTML5**: Semantic structure
- **CSS3**: Modern styling with animations
- **JavaScript ES6+**: Object-oriented programming
- **Google Fonts**: Orbitron & Roboto Mono

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MySQL2**: Database driver
- **Helmet.js**: Security middleware
- **bcrypt**: Password hashing
- **JWT**: Token authentication

### Security Tools
- **Content Security Policy**: XSS prevention
- **Rate Limiting**: Brute force protection
- **Input Sanitization**: Data validation
- **Session Management**: Secure state handling

## 🧪 Testing the Demos

### XSS Demo
1. Open `http://localhost:3000/`
2. Try these payloads:
   ```html
   <script>alert('XSS!')</script>
   <img src="x" onerror="alert('XSS')">
   javascript:alert("XSS")
   ```

### SQL Injection Demo
1. Use API endpoints:
   ```bash
   # Vulnerable endpoint
   curl -X POST http://localhost:3000/api/sql/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   
   # Secure endpoint
   curl -X POST http://localhost:3000/api/sql-secure/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```

## 📊 API Endpoints

### Health & Info
- `GET /health` - Server health check
- `GET /api/security-info` - Security configuration info

### XSS Demo
- `POST /api/xss/vulnerable` - Vulnerable endpoint
- `POST /api/xss/secure` - Secure endpoint
- `POST /api/xss/detect` - XSS detection
- `POST /api/xss/sanitize` - Input sanitization

### SQL Injection Demo
- `POST /api/sql/login` - Vulnerable login
- `POST /api/sql-secure/login` - Secure login

### CSRF Protection
- Available as middleware for all POST requests

## 🚨 Important Notes

### Educational Purpose
- This is a **learning platform** for cybersecurity education
- Vulnerable implementations are **intentionally insecure**
- Always use secure practices in production applications

### Database Setup
- MySQL/MariaDB required for full functionality
- Demo data will be created automatically
- Default credentials: `admin/admin123`, `user1/password123`

### Security Considerations
- Change default passwords in production
- Use strong JWT secrets
- Enable HTTPS in production
- Regular security audits

## 👨‍💻 Author

**Mohamed Adil** - Cybersecurity Educator
- Email: officialadil2k5@gmail.com
- Focus: Web Security, Vulnerability Assessment, Secure Coding
- Specialties: XSS, SQL Injection, CSRF, Security Testing

## 📄 License

MIT License - Feel free to use and modify for educational purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📚 Learning Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Security Fundamentals](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Secure Coding Practices](https://cheatsheetseries.owasp.org/)

---

**⚠️ Remember**: This platform is for educational purposes only. Always implement proper security measures in production applications! 