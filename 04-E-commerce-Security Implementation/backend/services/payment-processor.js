const crypto = require('crypto');

class PaymentProcessor {
    constructor() {
        this.encryptionKey = process.env.PAYMENT_ENCRYPTION_KEY || crypto.randomBytes(32);
    }
    
    // Tokenize sensitive payment data
    tokenizeCardData(cardNumber, cvv) {
        const token = crypto.randomBytes(16).toString('hex');
        
        // In production, store encrypted data in secure vault
        const encryptedData = this.encrypt(JSON.stringify({
            cardNumber: cardNumber,
            token: token,
            timestamp: Date.now()
        }));
        
        return {
            token: token,
            last4: cardNumber.slice(-4),
            encryptedData: encryptedData
        };
    }
    
    // Encrypt sensitive data
    encrypt(text) {
        const cipher = crypto.createCipher('aes-256-cbc', this.encryptionKey);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }
    
    // Decrypt sensitive data
    decrypt(encryptedText) {
        const decipher = crypto.createDecipher('aes-256-cbc', this.encryptionKey);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    
    // Validate payment data according to PCI DSS
    validatePaymentData(paymentData) {
        const errors = [];
        
        // Card number validation (Luhn algorithm)
        if (!this.isValidCardNumber(paymentData.cardNumber)) {
            errors.push('Invalid card number');
        }
        
        // CVV validation
        if (!paymentData.cvv || paymentData.cvv.length < 3 || paymentData.cvv.length > 4) {
            errors.push('Invalid CVV');
        }
        
        // Expiry date validation
        if (!this.isValidExpiryDate(paymentData.expiryMonth, paymentData.expiryYear)) {
            errors.push('Invalid expiry date');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    isValidCardNumber(cardNumber) {
        // Luhn algorithm implementation
        const digits = cardNumber.replace(/\D/g, '');
        let sum = 0;
        let isEven = false;
        
        for (let i = digits.length - 1; i >= 0; i--) {
            let digit = parseInt(digits[i]);
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    }
    
    isValidExpiryDate(month, year) {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        
        const expMonth = parseInt(month);
        const expYear = parseInt(year);
        
        if (expYear < currentYear) {
            return false;
        }
        
        if (expYear === currentYear && expMonth < currentMonth) {
            return false;
        }
        
        return expMonth >= 1 && expMonth <= 12;
    }
}

module.exports = PaymentProcessor;