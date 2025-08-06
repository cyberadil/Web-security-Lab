# 🎨 Cyberpunk Theme Guide

## Overview
All Web Security Lab demos now use a consistent cyberpunk/neon theme with dark backgrounds and glowing elements.

## Theme Features

### 🌈 Color Palette
- **Primary Neon**: `#00ff88` (Green) - Success, secure elements
- **Danger Neon**: `#ff0040` (Red) - Vulnerabilities, errors  
- **Warning Neon**: `#ffaa00` (Orange) - Warnings, important info
- **Accent Neon**: `#0080ff` (Blue) - Interactive elements
- **Secondary Neon**: `#ff0080` (Pink) - Special highlights

### 🎯 Design Elements
- **Animated Grid Background**: Subtle moving grid pattern
- **Neon Glows**: Hover effects with colored shadows
- **Gradient Borders**: Top borders on cards with color gradients
- **Typography**: Orbitron for headings, Roboto Mono for body
- **Cyberpunk Icons**: ⚡🔧💥⚠️ icons in headings

### 📁 File Structure
```
shared/
└── css/
    └── cyberpunk-theme.css    # Main theme file
```

## How to Apply Theme

### Method 1: Automatic Application (Recommended)
Run the theme application script:
```powershell
.\apply-theme-to-all-labs.ps1
```

This will:
- ✅ Add shared theme to all lab HTML files
- ✅ Create backups of original files
- ✅ Ensure consistent theming across all demos

### Method 2: Manual Application
Add this line to the `<head>` section of any HTML file:
```html
<link rel="stylesheet" href="/shared/css/cyberpunk-theme.css">
```

## Theme Usage

### CSS Classes Available

#### Layout
- `.container` - Main content container
- `.demo-grid` - Responsive grid layout
- `.demo-section` - Card-style sections
- `.card` - Generic card component

#### Colors & Status
- `.color-primary` - Primary neon color
- `.color-danger` - Danger/error color  
- `.color-warning` - Warning color
- `.color-accent` - Accent color
- `.status.secure` - Green secure status
- `.status.vulnerable` - Red vulnerable status
- `.status.warning` - Orange warning status

#### Buttons
- `.btn` - Primary button style
- `.btn-danger` - Red danger button
- `.btn-secondary` - Blue accent button
- `.btn-secure` - Green secure button

#### Components
- `.result` - Output/result containers
- `.output-box` - Code output display
- `.warning` - Warning message boxes
- `.info-section` - Information panels
- `.product-card` - E-commerce product cards
- `.metric-card` - Dashboard metric displays

### Example Usage
```html
<!-- Basic card with primary theme -->
<div class="demo-section">
    <h2>🔍 Security Test</h2>
    <p>Test content here</p>
    <button class="btn">Primary Action</button>
    <button class="btn-danger">Dangerous Action</button>
</div>

<!-- Status indicators -->
<span class="status secure">✅ Secure</span>
<span class="status vulnerable">❌ Vulnerable</span>

<!-- Results display -->
<div class="result secure">
    <h3>✅ Test Passed</h3>
    <p>Security check completed successfully.</p>
</div>
```

## Labs Using Theme

### ✅ Currently Themed
- **XSS Demo**: Dark theme with security-focused styling
- **SQL Injection Demo**: Red/orange danger theme
- **CSRF Demo**: Blue/pink accent theme  
- **E-commerce Security**: Green/orange commerce theme
- **Security Dashboard**: Comprehensive dashboard styling
- **Demo Hub**: Modern landing page theme
- **Connection Test**: Developer-focused theme

### 🎨 Theme Customization

#### Per-Lab Color Overrides
Each lab can override theme colors:
```css
/* Override primary color for specific lab */
:root {
    --primary-neon: #ff6b00; /* Custom orange */
}

/* Lab-specific section styling */
.demo-section.custom::before {
    background: linear-gradient(90deg, #ff6b00, #ff0080);
}
```

#### Adding New Components
```css
/* Custom component following theme pattern */
.my-component {
    background: var(--bg-card);
    border: 1px solid var(--border-neon);
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
}

.my-component:hover {
    border-color: var(--primary-neon);
    box-shadow: var(--shadow-neon);
    transform: translateY(-2px);
}
```

## Responsive Design

### Breakpoints
- **Mobile**: `@media (max-width: 480px)`
- **Tablet**: `@media (max-width: 768px)`  
- **Desktop**: `@media (min-width: 769px)`

### Mobile Optimizations
- Stacked grid layouts
- Full-width buttons
- Reduced padding
- Smaller font sizes
- Simplified animations

## Browser Support

### ✅ Fully Supported
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 🔶 Partial Support
- Internet Explorer: Basic styling (no CSS Grid)
- Older mobile browsers: Reduced animations

## Performance

### Optimizations
- CSS variables for consistent theming
- Efficient animations using transform/opacity
- Minimal DOM manipulation
- Optimized font loading

### Loading Order
1. Google Fonts (Orbitron, Roboto Mono)
2. Shared cyberpunk theme CSS
3. Lab-specific CSS (if any)
4. Inline styles (minimal)

## Troubleshooting

### Theme Not Loading
1. **Check server is running**: `npm start`
2. **Verify CSS path**: Should be `/shared/css/cyberpunk-theme.css`
3. **Clear browser cache**: Ctrl+F5 or hard refresh
4. **Check console for errors**: F12 Developer Tools

### Common Issues

#### White/Plain Theme Still Showing
```bash
# Fix: Ensure shared CSS is properly linked
# Check if this line exists in HTML <head>:
<link rel="stylesheet" href="/shared/css/cyberpunk-theme.css">
```

#### CSS Not Loading from Server
```javascript
// Fix: Verify server.js serves shared directory
app.use(express.static(path.join(__dirname)));
```

#### Inconsistent Colors
```css
/* Fix: Ensure CSS variables are available */
:root {
    --primary-neon: #00ff88;
    /* ... other variables */
}
```

## Migration Guide

### From Inline Styles
1. **Backup original files** (script does this automatically)
2. **Add shared theme link** to HTML head
3. **Remove/update inline styles** as needed
4. **Test all functionality** works with new theme

### From External CSS
1. **Keep existing CSS** for lab-specific styling
2. **Add shared theme as first CSS** import
3. **Update selectors** to use theme classes
4. **Remove duplicate** color/layout definitions

## Future Enhancements

### Planned Features
- 🌗 Dark/Light theme toggle
- 🎨 Multiple color schemes
- 📱 Enhanced mobile animations
- ⚡ Performance optimizations
- 🎛️ Customization panel

### Contributing
To extend the theme:
1. Add new CSS variables to `:root`
2. Create components following existing patterns
3. Maintain responsive design principles
4. Test across all labs
5. Update this documentation

---

🚀 **Result**: All your security labs now have a consistent, professional cyberpunk theme that enhances the educational experience while maintaining excellent usability and accessibility.