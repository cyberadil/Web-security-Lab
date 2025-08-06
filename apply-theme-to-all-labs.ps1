# Apply Cyberpunk Theme to All Web Security Labs
# Created by Mohamed Adil

Write-Host "🎨 Applying Cyberpunk Theme to All Security Labs..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Function to backup original files
function Backup-OriginalFile {
    param([string]$FilePath)
    
    $backupPath = $FilePath + ".backup"
    if (!(Test-Path $backupPath)) {
        Copy-Item $FilePath $backupPath
        Write-Host "✅ Backed up: $FilePath" -ForegroundColor Green
    }
}

# Function to update HTML file with shared theme
function Update-HtmlWithSharedTheme {
    param([string]$HtmlFile, [string]$LabName)
    
    Write-Host "🔧 Processing: $LabName..." -ForegroundColor Yellow
    
    if (!(Test-Path $HtmlFile)) {
        Write-Host "❌ File not found: $HtmlFile" -ForegroundColor Red
        return
    }
    
    # Backup original
    Backup-OriginalFile -FilePath $HtmlFile
    
    # Read content
    $content = Get-Content $HtmlFile -Raw
    
    # Check if shared theme is already included
    if ($content -match "/shared/css/cyberpunk-theme.css") {
        Write-Host "✅ $LabName already uses shared theme" -ForegroundColor Green
        return
    }
    
    # Find the head section and add shared theme
    if ($content -match "<head>") {
        # Add shared theme link after <head>
        $newContent = $content -replace "(<head>[^>]*>)", "`$1`n    <link rel=`"stylesheet`" href=`"/shared/css/cyberpunk-theme.css`">"
        
        # Write updated content
        $newContent | Set-Content $HtmlFile -NoNewline
        Write-Host "✅ Updated: $LabName" -ForegroundColor Green
    } else {
        Write-Host "❌ Could not find <head> tag in: $LabName" -ForegroundColor Red
    }
}

# Labs to update
$labs = @(
    @{
        Name = "XSS Demo"
        Path = "d:\Web security Lab - Copy\01-XSS-Demo Implementation\frontend\index.html"
    },
    @{
        Name = "SQL Injection Demo"  
        Path = "d:\Web security Lab - Copy\02-SQL-Injection-Demo Implementation\frontend\index.html"
    },
    @{
        Name = "CSRF Demo"
        Path = "d:\Web security Lab - Copy\03-CSRF-Demo Implementation\frontend\index.html"
    },
    @{
        Name = "E-commerce Security"
        Path = "d:\Web security Lab - Copy\04-E-commerce-Security Implementation\frontend\index.html"
    },
    @{
        Name = "Security Dashboard"
        Path = "d:\Web security Lab - Copy\05-Security-Dashboard Implementation\frontend\index.html"
    },
    @{
        Name = "Demo Hub"
        Path = "d:\Web security Lab - Copy\start-demo.html"
    },
    @{
        Name = "Connection Test"
        Path = "d:\Web security Lab - Copy\test-connection.html"
    }
)

# Process each lab
foreach ($lab in $labs) {
    Update-HtmlWithSharedTheme -HtmlFile $lab.Path -LabName $lab.Name
}

Write-Host ""
Write-Host "🎨 Theme Application Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor White
Write-Host "• Created shared theme: /shared/css/cyberpunk-theme.css" -ForegroundColor Gray
Write-Host "• Updated all lab HTML files to include shared theme" -ForegroundColor Gray  
Write-Host "• Created backups of original files (.backup extension)" -ForegroundColor Gray
Write-Host "• All labs now use consistent cyberpunk theme" -ForegroundColor Gray

Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor White
Write-Host "1. Start your server: npm start" -ForegroundColor Cyan
Write-Host "2. Visit: http://localhost:3000/" -ForegroundColor Cyan
Write-Host "3. Check all labs have consistent dark theme" -ForegroundColor Cyan

Write-Host ""
Write-Host "🔄 To revert changes:" -ForegroundColor Yellow
Write-Host "   Restore .backup files if needed" -ForegroundColor Yellow

Write-Host ""
Write-Host "✨ Enjoy your cyberpunk-themed security labs!" -ForegroundColor Magenta