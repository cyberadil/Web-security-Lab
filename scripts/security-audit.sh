#!/bin/bash

echo "🔍 Running Security Audit..."

# Check for vulnerabilities in dependencies
echo "📋 Checking npm vulnerabilities..."
npm audit

# Run security tests
echo "🧪 Running security tests..."
npm run test:security

# Check for hardcoded secrets
echo "🔐 Scanning for hardcoded secrets..."
grep -r "password\|secret\|key" --exclude-dir=node_modules --exclude="*.md" .

# Check file permissions
echo "📁 Checking file permissions..."
find . -type f -perm 777 2>/dev/null

echo "✅ Security audit complete!"